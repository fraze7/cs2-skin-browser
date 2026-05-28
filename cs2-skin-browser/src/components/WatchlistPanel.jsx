import SkinCard from './SkinCard'

export default function WatchlistPanel({ watchlist, onWatch }) {
  if (!watchlist.length) return null

  return (
    <section className="watchlist-panel">
      <h2 className="watchlist-title">Watchlist ({watchlist.length})</h2>
      <div className="listings-grid">
        {watchlist.map(listing => (
          <SkinCard
            key={listing.id}
            listing={listing}
            watched
            onWatch={onWatch}
          />
        ))}
      </div>
    </section>
  )
}
