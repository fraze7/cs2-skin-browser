import { useState, useEffect, useRef } from 'react'
import { sampleListings } from '../data/sampleListings'
import { floatBounds, filterListings } from '../utils/listings'

const API_BASE = '/api'
const CACHE_MS = 5 * 60 * 1000

// Results per query string for this page session, so flipping between filters doesn't refetch
const responseCache = new Map() // query string → { listings, time }

export function useSkinListings(filters) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const timerRef = useRef(null)
  // Search is applied client-side in App, so it shouldn't trigger a refetch
  const filtersKey = JSON.stringify({ ...filters, search: undefined })

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const f = JSON.parse(filtersKey)
      const limit = f.defIndex ? 50 : 20
      const params = new URLSearchParams({ limit, type: 'buy_now' })

      if (f.defIndex) params.set('def_index', f.defIndex)
      if (f.sortBy) params.set('sort_by', f.sortBy)

      const [min, max] = floatBounds(f)
      if (min > 0) params.set('min_float', min)
      if (max < 1) params.set('max_float', max)

      const qs = params.toString()
      const cached = responseCache.get(qs)
      if (cached && Date.now() - cached.time < CACHE_MS) {
        setListings(cached.listings)
        setError(null)
        setUsingFallback(false)
        return
      }

      setLoading(true)
      setError(null)
      setUsingFallback(false)
      try {
        const res = await fetch(`${API_BASE}/listings?${qs}`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || body.error || `HTTP ${res.status}`)
        }
        const json = await res.json()
        const data = json.data ?? []
        responseCache.set(qs, { listings: data, time: Date.now() })
        setListings(data)
      } catch (e) {
        // Live API failed — show sample data so the UI still demonstrates functionality
        setListings(filterListings(sampleListings, f))
        setUsingFallback(true)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timerRef.current)
  }, [filtersKey])

  return { listings, loading, error, usingFallback }
}
