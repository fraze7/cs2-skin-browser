// @vitest-environment node
// Tests for the Vercel function in ../../api/listings.js. It lives here rather than in api/,
// because Vercel would deploy any file in api/ as its own function.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

let handler
let fetchMock

// A fake CSFloat: responds with listings, or with a 429 when `failing` is set
function fakeCsfloat({ failing = false } = {}) {
  fetchMock = vi.fn(async () => failing
    ? { ok: false, status: 429, json: async () => ({ error: 'too many IPs' }) }
    : { ok: true, status: 200, json: async () => ({ data: [{ id: fetchMock.mock.calls.length }] }) })
  vi.stubGlobal('fetch', fetchMock)
}

// Calls the handler with a minimal Vercel-style req/res and resolves with what it sent
function call(query) {
  return new Promise(resolve => {
    const res = {
      headers: {},
      setHeader(k, v) { this.headers[k] = v },
      status(code) { this.code = code; return this },
      json(body) { resolve({ code: this.code, body, cacheControl: this.headers['Cache-Control'] }) },
    }
    handler({ query }, res)
  })
}

const QUERY = { limit: '20', type: 'buy_now', sort_by: 'best_deal' }

describe('api/listings', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    vi.stubEnv('CSFLOAT_API_KEY', 'test-key')
    vi.resetModules() // fresh in-memory cache for every test
    handler = (await import('../../api/listings.js')).default
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns 500 when the API key is missing', async () => {
    vi.stubEnv('CSFLOAT_API_KEY', '')
    fakeCsfloat()
    const r = await call(QUERY)
    expect(r.code).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards only known params and sends the key', async () => {
    fakeCsfloat()
    await call({ ...QUERY, junk: 'abc' })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://csfloat.com/api/v1/listings?limit=20&type=buy_now&sort_by=best_deal')
    expect(options.headers.Authorization).toBe('test-key')
  })

  it('caches successful responses at the edge and in memory', async () => {
    fakeCsfloat()
    const first = await call(QUERY)
    expect(first.cacheControl).toContain('s-maxage=300')

    const again = await call({ ...QUERY, junk: 'different' })
    expect(again.body).toEqual(first.body)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('passes CSFloat errors through and then waits a minute before calling again', async () => {
    fakeCsfloat({ failing: true })
    expect((await call(QUERY)).code).toBe(429)
    expect((await call({ ...QUERY, def_index: '9' })).code).toBe(429)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(61 * 1000)
    await call(QUERY)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('serves the last good listings when CSFloat starts failing', async () => {
    fakeCsfloat()
    const good = await call(QUERY)

    vi.advanceTimersByTime(10 * 60 * 1000) // past the 5 min freshness window
    fakeCsfloat({ failing: true })
    const r = await call(QUERY)
    expect(r.code).toBe(200)
    expect(r.body).toEqual(good.body)
  })
})
