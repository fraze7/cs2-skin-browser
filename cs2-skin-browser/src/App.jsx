import { useState, useEffect } from 'react'
import Header from './components/Header'
import FilterPanel from './components/FilterPanel'
import ListingsGrid from './components/ListingsGrid'
import WatchlistPanel from './components/WatchlistPanel'
import { useSkinListings } from './hooks/useSkinListings'

const DEFAULT_FILTERS = {
  search: '',
  defIndex: '',
  wears: [],
  minFloat: 0,
  maxFloat: 1,
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
  const { listings, loading, error } = useSkinListings(filters)

  const visibleListings = filters.search
    ? listings.filter(l =>
        l.item.market_hash_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    : listings

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
    <>
      <Header />
      <FilterPanel filters={filters} onChange={setFilters} />
      <main className="main">
        <ListingsGrid
          listings={visibleListings}
          total={listings.length}
          search={filters.search}
          loading={loading}
          error={error}
          watchlist={watchlist}
          onWatch={toggleWatch}
        />
        <WatchlistPanel watchlist={watchlist} onWatch={toggleWatch} />
      </main>
    </>
  )
}
