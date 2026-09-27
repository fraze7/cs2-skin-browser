export const WEAR_RANGES = {
  'Factory New': [0, 0.07],
  'Minimal Wear': [0.07, 0.15],
  'Field-Tested': [0.15, 0.38],
  'Well-Worn': [0.38, 0.45],
  'Battle-Scarred': [0.45, 1.0],
}

// Wear checkboxes take priority over the float sliders; multiple wears span min→max of their ranges
export function floatBounds(filters) {
  if (filters.wears.length > 0) {
    const ranges = filters.wears.map(w => WEAR_RANGES[w])
    return [Math.min(...ranges.map(r => r[0])), Math.max(...ranges.map(r => r[1]))]
  }
  return [filters.minFloat, filters.maxFloat]
}

const SORTERS = {
  lowest_price:  (a, b) => a.price - b.price,
  highest_price: (a, b) => b.price - a.price,
  lowest_float:  (a, b) => a.item.float_value - b.item.float_value,
  highest_float: (a, b) => b.item.float_value - a.item.float_value,
}

// Mirrors CSFloat's server-side filters so the sample data still responds to the UI.
// Sorts without mutating the input; sorts CSFloat has no local equivalent for keep the original order.
export function filterListings(listings, filters) {
  const [min, max] = floatBounds(filters)
  const result = listings.filter(l =>
    (!filters.defIndex || l.item.def_index === filters.defIndex) &&
    l.item.float_value >= min &&
    l.item.float_value <= max
  )
  return SORTERS[filters.sortBy] ? result.sort(SORTERS[filters.sortBy]) : result
}

// Text search is client-side — CSFloat's API has no name search
export function searchListings(listings, search) {
  if (!search) return listings
  const term = search.toLowerCase()
  return listings.filter(l => l.item.market_hash_name.toLowerCase().includes(term))
}
