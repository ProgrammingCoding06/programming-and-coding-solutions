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

    // Log to Vercel function logs for diagnostics
    // eslint-disable-next-line no-console
    console.log('[reviews] HTTP', detailRes.status, '| keys:', Object.keys(place).join(', ') || '(none)')

    if (!detailRes.ok || place.error) {
      // eslint-disable-next-line no-console
      console.error('[reviews] API error:', JSON.stringify(place.error ?? place))
      res.setHeader('Cache-Control', 'no-store')
      return res.status(502).json({ error: 'Places API error', reviews: [], rating: null, total: 0 })
    }

    const { rating, userRatingCount, reviews = [] } = place
    const hasData = rating !== null && rating !== undefined || reviews.length > 0

    // Only cache when Google gave us real data; empty results must not be cached
    res.setHeader(
      'Cache-Control',
      hasData ? 's-maxage=3600, stale-while-revalidate=600' : 'no-store'
    )

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
    // eslint-disable-next-line no-console
    console.error('[reviews] fetch failed:', err.message)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}
