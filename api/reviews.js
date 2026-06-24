const FIND_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
const DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')

  try {
    const findParams = new URLSearchParams({
      input: 'PR REMAPS Purfleet Essex',
      inputtype: 'textquery',
      fields: 'place_id',
      locationbias: 'point:51.4826,0.2342',
      key,
    })

    const findRes = await fetch(`${FIND_URL}?${findParams}`)
    const findData = await findRes.json()

    if (findData.status !== 'OK' || !findData.candidates?.length) {
      return res.status(200).json({ reviews: [], rating: null, total: 0 })
    }

    const placeId = findData.candidates[0].place_id

    const detailParams = new URLSearchParams({
      place_id: placeId,
      fields: 'reviews,rating,user_ratings_total',
      key,
    })

    const detailRes = await fetch(`${DETAIL_URL}?${detailParams}`)
    const detailData = await detailRes.json()

    if (detailData.status !== 'OK') {
      return res.status(200).json({ reviews: [], rating: null, total: 0 })
    }

    const { reviews = [], rating, user_ratings_total } = detailData.result

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
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}
