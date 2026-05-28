import SkinCard from './SkinCard'

export default function ListingsGrid({ listings, loading, error, watchlist, onWatch }) {
  if (loading) return <div className="status-msg">Loading listings…</div>
  if (error)   return <div className="status-msg error">Error: {error}</div>
  if (!listings.length) return <div className="status-msg">No listings found.</div>

  return (
    <div className="listings-grid">
      {listings.map(listing => (
        <SkinCard
          key={listing.id}
          listing={listing}
          watched={watchlist.some(w => w.id === listing.id)}
          onWatch={onWatch}
        />
      ))}
    </div>
  )
}
