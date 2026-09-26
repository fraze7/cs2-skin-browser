// Proxies CSFloat listings so the API key stays server-side.
//
// CSFloat blocks a key that's used from "too many IPs", and Vercel functions don't have a
// fixed outgoing IP — so the goal here is to call CSFloat as rarely as possible:
//   - only known params are forwarded, so junk query strings can't bypass the cache
//   - successful responses are cached at Vercel's edge (see Cache-Control below)
//   - a warm function instance also keeps recent responses in memory, and serves them
//     (even if stale) when CSFloat errors
//   - after CSFloat returns an error, this instance waits a minute before trying again,
//     so a blocked key isn't hammered with retries

const ALLOWED_PARAMS = ['limit', 'type', 'def_index', 'min_float', 'max_float', 'sort_by']
const FRESH_MS = 5 * 60 * 1000
const MAX_CACHE_ENTRIES = 100
const memoryCache = new Map() // query string → { data, time }, oldest first
const ERROR_COOLDOWN_MS = 60 * 1000
let lastError = null // { status, data, time } — the block is per key, so this is shared by all queries

function buildQuery(query) {
  const params = new URLSearchParams()
  for (const key of ALLOWED_PARAMS) {
    if (query[key] !== undefined && query[key] !== '') params.set(key, query[key])
  }
  return params.toString()
}

export default async function handler(req, res) {
  const apiKey = process.env.CSFLOAT_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const qs = buildQuery(req.query)
  const cached = memoryCache.get(qs)

  // Edge: serve for 5 min, then keep serving the old copy for up to an hour while one request refreshes it
  const okCache = 's-maxage=300, stale-while-revalidate=3600'

  if (cached && Date.now() - cached.time < FRESH_MS) {
    res.setHeader('Cache-Control', okCache)
    return res.status(200).json(cached.data)
  }

  if (lastError && Date.now() - lastError.time < ERROR_COOLDOWN_MS) {
    if (cached) return res.status(200).json(cached.data)
    return res.status(lastError.status).json(lastError.data)
  }

  try {
    const response = await fetch(`https://csfloat.com/api/v1/listings?${qs}`, {
      headers: { Authorization: apiKey },
    })
    const data = await response.json()

    if (!response.ok) {
      lastError = { status: response.status, data, time: Date.now() }
      // CSFloat is refusing us — stale listings beat no listings
      if (cached) return res.status(200).json(cached.data)
      return res.status(response.status).json(data)
    }

    lastError = null
    memoryCache.delete(qs)
    memoryCache.set(qs, { data, time: Date.now() })
    if (memoryCache.size > MAX_CACHE_ENTRIES) {
      memoryCache.delete(memoryCache.keys().next().value)
    }
    res.setHeader('Cache-Control', okCache)
    res.status(200).json(data)
  } catch (err) {
    if (cached) return res.status(200).json(cached.data)
    res.status(500).json({ error: err.message })
  }
}
