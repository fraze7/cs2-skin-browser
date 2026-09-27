import { describe, it, expect } from 'vitest'
import { sampleListings } from './sampleListings'
import { WEAR_RANGES } from '../utils/listings'

// Weapons offered in the FilterPanel dropdown — each should have sample listings to show
const DROPDOWN_DEF_INDEXES = [7, 16, 60, 9, 1, 61, 4, 3, 34, 36, 507, 515, 508]

describe('sampleListings', () => {
  it('has unique ids', () => {
    const ids = sampleListings.map(l => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has a float inside the range of its wear for every listing', () => {
    for (const { item } of sampleListings) {
      const [min, max] = WEAR_RANGES[item.wear_name]
      expect(item.float_value, item.market_hash_name).toBeGreaterThanOrEqual(min)
      expect(item.float_value, item.market_hash_name).toBeLessThanOrEqual(max)
    }
  })

  it('names the wear in each market_hash_name', () => {
    for (const { item } of sampleListings) {
      expect(item.market_hash_name).toContain(`(${item.wear_name})`)
    }
  })

  it('covers every weapon in the dropdown and every wear', () => {
    const defIndexes = new Set(sampleListings.map(l => l.item.def_index))
    for (const d of DROPDOWN_DEF_INDEXES) expect(defIndexes, `def_index ${d}`).toContain(d)

    const wears = new Set(sampleListings.map(l => l.item.wear_name))
    expect([...wears].sort()).toEqual(Object.keys(WEAR_RANGES).sort())
  })

  it('uses bare image hashes, not full URLs', () => {
    for (const { item } of sampleListings) expect(item.icon_url).not.toMatch(/^https?:/)
  })
})
