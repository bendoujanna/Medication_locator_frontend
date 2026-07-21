export function formatCountdown(msRemaining) {
  if (msRemaining <= 0) return '0:00:00'
  const s = Math.floor(msRemaining / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export function formatDistance(km) {
  return `${Number(km).toFixed(1)} km`
}

export function timeAgo(isoString) {
  const diffMs  = Date.now() - new Date(isoString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1)  return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const h = Math.floor(diffMin / 60)
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

export function maskPhone(phone) {
  if (!phone || phone.length < 8) return phone
  return `${phone.slice(0,4)} ${phone.slice(4,6)}•• •${phone.slice(-3)}`
}

export function truncate(text, max = 40) {
  if (!text || text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}