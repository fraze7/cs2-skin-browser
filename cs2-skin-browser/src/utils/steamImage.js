// community.cloudflare.steamstatic.com now just 301-redirects here
const CDN = 'https://community.steamstatic.com/economy/image'

export function getImageUrl(iconUrl) {
  if (!iconUrl) return ''
  // Some sources hand back a full URL — keep only the hash so every image goes through the same CDN
  const hash = iconUrl.includes('/economy/image/')
    ? iconUrl.split('/economy/image/')[1].split('/')[0]
    : iconUrl
  return `${CDN}/${hash}/256fx256f`
}
