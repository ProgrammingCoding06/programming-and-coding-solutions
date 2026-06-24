const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  const debug = req.query?.debug === '1'

  try {
    let placeId = null
    const searches = []

    for (const textQuery of [
      'Programming and Coding Solutions Purfleet Essex',
      'PR REMAPS Purfleet Essex',
    ]) {
      const searchRes = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.id,places.displayName',
        },
        body: JSON.stringify({
          textQuery,
          locationBias: {
            circle: {
              center: { latitude: 51.4826, longitude: 0.2342 },
              radius: 5000,
            },
          },
          languageCode: 'en',
          maxResultCount: 1,
        }),
      })

      const searchData = await searchRes.json()
      searches.push({ textQuery, response: searchData })

      if (searchData.places?.length) {
        placeId = searchData.places[0].id
        break
      }
    }

    if (!placeId) {
      if (debug) return res.status(200).json({ searches, placeId: null })
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ reviews: [], rating: null, total: 0 })
    }

    const detailRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
    })
    const place = await detailRes.json()

    if (debug) return res.status(200).json({ searches, placeId, place })

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
