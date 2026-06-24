const PLACE_ID = 'ChIJrTsWgY2x2EcRsYvwOkwRatU'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  const debug = req.query?.debug === '1'

  try {
    const detailRes = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': debug ? '*' : 'rating,userRatingCount,reviews',
      },
    })
    const place = await detailRes.json()

    if (debug) return res.status(200).json(place)

    const { rating, userRatingCount, reviews = [] } = place

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json({
      reviews: reviews.map(r => ({
        name: r.authorAttribution?.displayName || 'Anonymous',
        rating: r.rating,
        text: r.text?.text || '',
        time: r.relativePublishTimeDescription,
      })),
      rating,
      total: userRatingCount,
    })
  } catch (err) {
    console.error('[reviews]', err)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: String(err) })
  }
}
