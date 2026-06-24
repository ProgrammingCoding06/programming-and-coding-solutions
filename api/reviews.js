const FIND_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
const DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  const debug = req.query?.debug === '1'

  try {
    const searches = []

    for (const [input, inputtype] of [
      ['+447783597186', 'phonenumber'],
      ['Programming and Coding Solutions Purfleet Essex', 'textquery'],
      ['PR REMAPS Purfleet Essex', 'textquery'],
    ]) {
      const params = new URLSearchParams({ input, inputtype, fields: 'place_id', key })
      if (inputtype === 'textquery') params.set('locationbias', 'point:51.4826,0.2342')
      const r = await fetch(`${FIND_URL}?${params}`)
      const d = await r.json()
      searches.push({ input, inputtype, status: d.status, candidates: d.candidates ?? [] })
      if (d.status === 'OK' && d.candidates?.length) break
    }

    const found = searches.find(s => s.status === 'OK' && s.candidates.length)
    const placeId = found?.candidates[0]?.place_id ?? null

    if (debug) return res.status(200).json({ searches, placeId })

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

    if (debug) return res.status(200).json({ searches, placeId, detail: detailData })

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
    return res.status(500).json({ error: String(err) })
  }
}
