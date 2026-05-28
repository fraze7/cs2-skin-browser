import { useState, useEffect, useRef } from 'react'

const API_BASE = '/csfloat-api/v1'

const WEAR_RANGES = {
  'Factory New':    [0,    0.07],
  'Minimal Wear':   [0.07, 0.15],
  'Field-Tested':   [0.15, 0.38],
  'Well-Worn':      [0.38, 0.45],
  'Battle-Scarred': [0.45, 1.0],
}

export function useSkinListings(filters) {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const timerRef = useRef(null)
  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const f = JSON.parse(filtersKey)
      const params = new URLSearchParams({ limit: 20, type: 'buy_now' })

      const nameParts = [f.weapon, f.search].filter(Boolean).join(' | ')
      if (nameParts) params.set('market_hash_name', nameParts)

      if (f.wears.length > 0) {
        const ranges = f.wears.map(w => WEAR_RANGES[w])
        params.set('min_float', Math.min(...ranges.map(r => r[0])))
        params.set('max_float', Math.max(...ranges.map(r => r[1])))
      } else {
        if (f.minFloat > 0) params.set('min_float', f.minFloat)
        if (f.maxFloat < 1) params.set('max_float', f.maxFloat)
      }

      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${API_BASE}/listings?${params}`, {
          headers: { Authorization: import.meta.env.VITE_CSFLOAT_API_KEY },
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || `HTTP ${res.status}`)
        }
        const json = await res.json()
        setListings(json.data ?? [])
      } catch (e) {
        setError(e.message)
        setListings([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timerRef.current)
  }, [filtersKey])

  return { listings, loading, error }
}
