const PLACE_ID = 'ChIJrTsWgY2x2EcRsYvwOkwRatU'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews&language=en&key=${key}`

    const detailRes = await fetch(url)
    const data = await detailRes.json()

    // eslint-disable-next-line no-console
    console.log('[reviews] status:', data.status, '| reviews:', data.result?.reviews?.length ?? 0)

    if (data.status !== 'OK') {
      // eslint-disable-next-line no-console
      console.error('[reviews] API error:', data.status, data.error_message ?? '')
      res.setHeader('Cache-Control', 'no-store')
      return res.status(502).json({ error: data.status, reviews: [], rating: null, total: 0 })
    }

    const { rating, user_ratings_total: total, reviews = [] } = data.result || {}
    const hasData = rating !== undefined || reviews.length > 0

    res.setHeader(
      'Cache-Control',
      hasData ? 's-maxage=3600, stale-while-revalidate=600' : 'no-store'
    )

    return res.status(200).json({
      reviews: reviews.map(r => ({
        name: r.author_name || 'Anonymous',
        rating: r.rating,
        text: r.text || '',
        time: r.relative_time_description,
      })),
      rating: rating ?? null,
      total: total ?? 0,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[reviews] fetch failed:', err.message)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Failed to fetch reviews' })
  }
}
