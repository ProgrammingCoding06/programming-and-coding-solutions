const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'
const NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby'

async function post(url, key, fieldMask, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  const debug = req.query?.debug === '1'

  try {
    const attempts = []
    let placeId = null

    // 1. Phone number search
    const phoneResult = await post(SEARCH_URL, key, 'places.id,places.displayName,places.userRatingCount', {
      textQuery: '+447783597186',
      maxResultCount: 1,
    })
    attempts.push({ method: 'phone', result: phoneResult })
    if (phoneResult.places?.length) {
      placeId = phoneResult.places[0].id
    }

    // 2. Nearby search — all businesses within 300m of the registered address
    if (!placeId) {
      const nearbyResult = await post(NEARBY_URL, key, 'places.id,places.displayName,places.userRatingCount', {
        locationRestriction: {
          circle: {
            center: { latitude: 51.4826, longitude: 0.2342 },
            radius: 300,
          },
        },
        maxResultCount: 10,
      })
      attempts.push({ method: 'nearby', result: nearbyResult })
      if (nearbyResult.places?.length) {
        placeId = nearbyResult.places[0].id
      }
    }

    if (!placeId) {
      if (debug) return res.status(200).json({ attempts, placeId: null })
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

    if (debug) return res.status(200).json({ attempts, placeId, place })

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
