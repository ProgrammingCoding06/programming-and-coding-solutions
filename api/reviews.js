const FIND_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
const DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json'

async function findPlaceId(key, input, inputtype) {
  const params = new URLSearchParams({ input, inputtype, fields: 'place_id', key })
  if (inputtype === 'textquery') params.set('locationbias', 'point:51.4826,0.2342')
  const res = await fetch(`${FIND_URL}?${params}`)
  const data = await res.json()
  if (data.status === 'OK' && data.candidates?.length) return data.candidates[0].place_id
  return null
}

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  try {
    // Phone number search is the most reliable — uniquely identifies the business
    let placeId = await findPlaceId(key, '+447783597186', 'phonenumber')

    if (!placeId) {
      for (const query of [
        'Programming and Coding Solutions Purfleet Essex',
        'Programming and Coding Solutions RM19',
        'PR REMAPS Purfleet Essex',
      ]) {
        placeId = await findPlaceId(key, query, 'textquery')
        if (placeId) break
      }
    }

    if (!placeId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ reviews: [], rating: null, total: 0 })
    }

    const detailParams = new URLSearchParams({
      place_id: placeId,
      fields: 'reviews,rating,user_ratings_total',
      language: 'en',
      key,
    })

    const detailRes = await fetch(`${DETAIL_URL}?${detailParams}`)
    const detailData = await detailRes.json()

    if (detailData.status !== 'OK') {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ reviews: [], rating: null, total: 0 })
    }

    const { reviews = [], rating, user_ratings_total } = detailData.result

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json({
      reviews: reviews.map(r => ({
        name: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description,
      })),
      rating,
      total: user_ratings_total,
    })
  } catch (err) {
    console.error('[reviews]', err)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}
