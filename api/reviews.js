const PLACE_ID = 'ChIJrTsWgY2x2EcRsYvwOkwRatU'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  try {
    const detailRes = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
    })
    const place = await detailRes.json()
    const { rating, userRatingCount, reviews = [] } = place

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
    return res.status(200).json({
      reviews: reviews.map(r => ({
        name: r.authorAttribution?.displayName || 'Anonymous',
        rating: r.rating,
        text: r.text?.text || '',
        time: r.relativePublishTimeDescription,
      })),
      rating: rating ?? null,
      total: userRatingCount ?? 0,
    })
  } catch (err) {
    console.error('[reviews]', err)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}
