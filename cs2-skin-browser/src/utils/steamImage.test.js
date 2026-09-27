import { describe, it, expect } from 'vitest'
import { getImageUrl } from './steamImage'

const CDN = 'https://community.steamstatic.com/economy/image'

describe('getImageUrl', () => {
  it('builds a CDN URL from a bare image hash', () => {
    expect(getImageUrl('abc123')).toBe(`${CDN}/abc123/256fx256f`)
  })

  it('rewrites full URLs on old Steam hosts to the current CDN', () => {
    expect(getImageUrl('https://community.cloudflare.steamstatic.com/economy/image/abc123/'))
      .toBe(`${CDN}/abc123/256fx256f`)
  })

  it('returns an empty string when there is no image', () => {
    expect(getImageUrl(undefined)).toBe('')
  })
})
