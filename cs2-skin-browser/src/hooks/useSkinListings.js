import { useState, useEffect, useRef } from 'react'
import { sampleListings } from '../data/sampleListings'

const API_BASE = '/api'

export const WEAR_RANGES = {
  'Factory New': [0, 0.07],
  'Minimal Wear': [0.07, 0.15],
  'Field-Tested': [0.15, 0.38],
  'Well-Worn': [0.38, 0.45],
  'Battle-Scarred': [0.45, 1.0],
}

// Wear checkboxes take priority over the float sliders; multiple wears span min→max of their ranges
function floatBounds(f) {
  if (f.wears.length > 0) {
    const ranges = f.wears.map(w => WEAR_RANGES[w])
    return [Math.min(...ranges.map(r => r[0])), Math.max(...ranges.map(r => r[1]))]
  }
  return [f.minFloat, f.maxFloat]
}

const SORTERS = {
  lowest_price:  (a, b) => a.price - b.price,
  highest_price: (a, b) => b.price - a.price,
  lowest_float:  (a, b) => a.item.float_value - b.item.float_value,
  highest_float: (a, b) => b.item.float_value - a.item.float_value,
}

// Mirror the server-side filters so the sample data still responds to the UI
function filterSample(f) {
  const [min, max] = floatBounds(f)
  const result = sampleListings.filter(l =>
    (!f.defIndex || l.item.def_index === f.defIndex) &&
    l.item.float_value >= min &&
    l.item.float_value <= max
  )
  return SORTERS[f.sortBy] ? result.sort(SORTERS[f.sortBy]) : result
}

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

      setLoading(true)
      setError(null)
      setUsingFallback(false)
      try {
        const res = await fetch(`${API_BASE}/listings?${params}`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || body.error || `HTTP ${res.status}`)
        }
        const json = await res.json()
        setListings(json.data ?? [])
      } catch (e) {
        // Live API failed — show sample data so the UI still demonstrates functionality
        setListings(filterSample(f))
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
