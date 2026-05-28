const CDN = 'https://community.cloudflare.steamstatic.com/economy/image'

function getImageUrl(iconUrl) {
  if (!iconUrl) return ''
  if (iconUrl.startsWith('http')) return iconUrl
  return `${CDN}/${iconUrl}/256fx256f`
}

export default function SkinCard({ listing, onWatch, watched }) {
  const { item, price } = listing
  const dollars = (price / 100).toFixed(2)
  const float   = item.float_value?.toFixed(6) ?? '—'
  const name    = item.item_name ?? item.market_hash_name

  return (
    <div className="skin-card" data-rarity={item.rarity}>
      <img
        src={getImageUrl(item.icon_url)}
        alt={name}
        loading="lazy"
      />
      <div className="skin-card-body">
        <div className="skin-badges">
          {item.is_stattrak && <span className="badge badge-stattrak">StatTrak™</span>}
          {item.is_souvenir && <span className="badge badge-souvenir">Souvenir</span>}
        </div>
        <p className="skin-name">{name}</p>
        <p className="skin-wear">{item.wear_name}</p>
        <p className="skin-float">{float}</p>
        <div className="skin-card-footer">
          <span className="skin-price">${dollars}</span>
          <button
            className={`watch-btn${watched ? ' watched' : ''}`}
            onClick={() => onWatch(listing)}
          >
            {watched ? '★ Watching' : '☆ Watch'}
          </button>
        </div>
      </div>
    </div>
  )
}
