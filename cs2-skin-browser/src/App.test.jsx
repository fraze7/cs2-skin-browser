import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// The API call is debounced by 500 ms, so give queries a little longer than the default 1 s
const WAIT = { timeout: 3000 }

async function renderWithFailingApi() {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 429 })))
  const user = userEvent.setup()
  render(<App />)
  await screen.findByText(/Showing sample listings/, {}, WAIT)
  return user
}

const cardNames = () => screen.getAllByText(/\|/, { selector: '.skin-name' }).map(el => el.textContent)

describe('App', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to sample listings with a banner when the API fails', async () => {
    await renderWithFailingApi()
    expect(cardNames().length).toBeGreaterThan(20)
    expect(screen.getByText(/CSFloat's free API key is for personal use/)).toBeInTheDocument()
  })

  it('filters the sample listings by weapon', async () => {
    const user = await renderWithFailingApi()
    await user.selectOptions(screen.getByDisplayValue('Any weapon'), 'AWP')

    await vi.waitFor(() => {
      const names = cardNames()
      expect(names.length).toBeGreaterThan(0)
      expect(names.every(n => n.includes('AWP |'))).toBe(true)
    }, WAIT)
  })

  it('searches by name without refetching', async () => {
    const user = await renderWithFailingApi()
    const callsBefore = fetch.mock.calls.length

    await user.type(screen.getByPlaceholderText(/Search skin name/), 'dragon lore')

    expect(cardNames()).toEqual(['AWP | Dragon Lore (Field-Tested)'])
    await new Promise(r => setTimeout(r, 700)) // past the debounce
    expect(fetch.mock.calls.length).toBe(callsBefore)
  })

  it('adds a listing to the watchlist and saves it to localStorage', async () => {
    const user = await renderWithFailingApi()
    await user.type(screen.getByPlaceholderText(/Search skin name/), 'dragon lore')
    await user.click(screen.getByRole('button', { name: /☆ Watch/ }))

    const panel = screen.getByRole('heading', { name: /Watchlist \(1\)/ }).closest('section')
    expect(within(panel).getByText('AWP | Dragon Lore (Field-Tested)')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('cs2-watchlist'))).toHaveLength(1)

    // Clicking again (from the watchlist panel) removes it
    await user.click(within(panel).getByRole('button', { name: /★ Watching/ }))
    expect(screen.queryByRole('heading', { name: /Watchlist/ })).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('cs2-watchlist'))).toEqual([])
  })

  it('reset puts every filter back to its default', async () => {
    const user = await renderWithFailingApi()
    const reset = screen.getByRole('button', { name: 'Reset filters' })
    expect(reset).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Sort by'), 'Price: low to high')
    await user.click(screen.getByLabelText('Factory New'))
    expect(reset).toBeEnabled()

    await user.click(reset)
    expect(screen.getByLabelText('Sort by')).toHaveDisplayValue('Best deal')
    expect(screen.getByLabelText('Factory New')).not.toBeChecked()
    expect(reset).toBeDisabled()
  })
})
