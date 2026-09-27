import { useState, useEffect } from 'react'
import Header from './components/Header'
import FilterPanel from './components/FilterPanel'
import ListingsGrid from './components/ListingsGrid'
import WatchlistPanel from './components/WatchlistPanel'
import { useSkinListings } from './hooks/useSkinListings'
import { searchListings } from './utils/listings'

const DEFAULT_FILTERS = {
  search: '',
  defIndex: '',
  wears: [],
  minFloat: 0,
  maxFloat: 1,
  sortBy: 'best_deal',
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cs2-watchlist')) ?? []
    } catch {
      return []
    }
  })
  const { listings, loading, error, usingFallback } = useSkinListings(filters)
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS)

  const visibleListings = searchListings(listings, filters.search)

  useEffect(() => {
    localStorage.setItem('cs2-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  function toggleWatch(listing) {
    setWatchlist(prev =>
      prev.some(w => w.id === listing.id)
        ? prev.filter(w => w.id !== listing.id)
        : [...prev, listing]
    )
  }

  return (
    <div>
      <Header />
      {usingFallback && (
        <div className="fallback-banner">
          Showing sample listings — CSFloat's free API key is for personal use,
          so live data only loads when running the project locally.
          {import.meta.env.DEV && error && ` (${error})`}
        </div>
      )}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        isDefault={isDefault}
      />
      <main className="main">
        <ListingsGrid
          listings={visibleListings}
          total={listings.length}
          search={filters.search}
          loading={loading}
          error={error}
          usingFallback={usingFallback}
          watchlist={watchlist}
          onWatch={toggleWatch}
        />
        <WatchlistPanel watchlist={watchlist} onWatch={toggleWatch} />
      </main>
    </div>
  )
}
