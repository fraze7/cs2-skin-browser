import { describe, it, expect } from 'vitest'
import { floatBounds, filterListings, searchListings } from './listings'

const DEFAULTS = { defIndex: '', wears: [], minFloat: 0, maxFloat: 1, sortBy: 'best_deal' }

function listing(id, { price = 1000, float = 0.2, defIndex = 7, name = `Item ${id}` } = {}) {
  return { id, price, item: { market_hash_name: name, float_value: float, def_index: defIndex } }
}

describe('floatBounds', () => {
  it('uses the float sliders when no wear is selected', () => {
    expect(floatBounds({ ...DEFAULTS, minFloat: 0.1, maxFloat: 0.5 })).toEqual([0.1, 0.5])
  })

  it('uses the wear range when one wear is selected, ignoring the sliders', () => {
    expect(floatBounds({ ...DEFAULTS, wears: ['Field-Tested'], minFloat: 0.9 })).toEqual([0.15, 0.38])
  })

  it('spans from the lowest to the highest of several selected wears', () => {
    expect(floatBounds({ ...DEFAULTS, wears: ['Battle-Scarred', 'Factory New'] })).toEqual([0, 1])
    expect(floatBounds({ ...DEFAULTS, wears: ['Minimal Wear', 'Field-Tested'] })).toEqual([0.07, 0.38])
  })
})

describe('filterListings', () => {
  const listings = [
    listing('ak-fn', { defIndex: 7, float: 0.03, price: 5000 }),
    listing('ak-ft', { defIndex: 7, float: 0.25, price: 1500 }),
    listing('awp-bs', { defIndex: 9, float: 0.6, price: 900 }),
  ]
  const ids = result => result.map(l => l.id)

  it('returns everything with default filters, in the original order', () => {
    expect(ids(filterListings(listings, DEFAULTS))).toEqual(['ak-fn', 'ak-ft', 'awp-bs'])
  })

  it('filters by weapon', () => {
    expect(ids(filterListings(listings, { ...DEFAULTS, defIndex: 9 }))).toEqual(['awp-bs'])
  })

  it('filters by wear', () => {
    expect(ids(filterListings(listings, { ...DEFAULTS, wears: ['Factory New'] }))).toEqual(['ak-fn'])
  })

  it('filters by float range', () => {
    expect(ids(filterListings(listings, { ...DEFAULTS, minFloat: 0.2, maxFloat: 0.7 }))).toEqual(['ak-ft', 'awp-bs'])
  })

  it('sorts by price and float in both directions', () => {
    expect(ids(filterListings(listings, { ...DEFAULTS, sortBy: 'lowest_price' }))).toEqual(['awp-bs', 'ak-ft', 'ak-fn'])
    expect(ids(filterListings(listings, { ...DEFAULTS, sortBy: 'highest_price' }))).toEqual(['ak-fn', 'ak-ft', 'awp-bs'])
    expect(ids(filterListings(listings, { ...DEFAULTS, sortBy: 'lowest_float' }))).toEqual(['ak-fn', 'ak-ft', 'awp-bs'])
    expect(ids(filterListings(listings, { ...DEFAULTS, sortBy: 'highest_float' }))).toEqual(['awp-bs', 'ak-ft', 'ak-fn'])
  })

  it('does not reorder the array it was given', () => {
    filterListings(listings, { ...DEFAULTS, sortBy: 'lowest_price' })
    expect(ids(listings)).toEqual(['ak-fn', 'ak-ft', 'awp-bs'])
  })
})

describe('searchListings', () => {
  const listings = [
    listing(1, { name: 'AK-47 | Redline (Field-Tested)' }),
    listing(2, { name: 'AWP | Asiimov (Field-Tested)' }),
  ]

  it('matches names case-insensitively', () => {
    expect(searchListings(listings, 'redLINE').map(l => l.id)).toEqual([1])
  })

  it('returns everything for an empty search', () => {
    expect(searchListings(listings, '')).toBe(listings)
  })
})
