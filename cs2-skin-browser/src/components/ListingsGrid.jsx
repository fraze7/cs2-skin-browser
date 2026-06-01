import SkinCard from './SkinCard'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line" style={{ width: '85%' }} />
        <div className="skeleton-line" style={{ width: '50%' }} />
        <div className="skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton-footer">
          <div className="skeleton-line" style={{ width: '35%' }} />
          <div className="skeleton-line" style={{ width: '25%' }} />
        </div>
      </div>
    </div>
  )
}

export default function ListingsGrid({ listings, total, loading, error, usingFallback, search, watchlist, onWatch }) {
  // Only show hard error when there is no fallback data to display
  if (error && !usingFallback) {
    return (
      <div className="status-msg error">
        <p>Could not load listings.</p>
        <p className="status-detail">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="listings-grid">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="status-msg">
        {search
          ? <span>No listings match <strong>"{search}"</strong>. Try a different search or select a weapon.</span>
          : 'No listings found. Try adjusting your filters.'}
      </div>
    )
  }

  const countLabel = search && total > listings.length
    ? `${listings.length} of ${total} listings match "${search}"`
    : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`

  return (
    <section>
      <p className="results-count">{countLabel}</p>
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
    </section>
  )
}
