/**
 * Formats milliseconds remaining into a HH:MM:SS countdown string.
 */
export function formatCountdown(msRemaining) {
  if (msRemaining <= 0) return '0:00:00'
  const totalSeconds = Math.floor(msRemaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Masks a phone number for clinic-side display
 */
export function maskPhoneNumber(phone) {
  if (!phone || phone.length < 8) return phone
  const country = phone.slice(0, 4)
  const head = phone.slice(4, 6)
  const tail = phone.slice(-3)
  return `${country} ${head}•• •${tail}`
}

/**
 * Formats a distance in km
 */
export function formatDistance(km) {
  return `${km.toFixed(1)} km`
}

/**
 * Formats a relative time ago string for hold request cards and alerts.
 */
export function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
}

/**
 * Truncates long addresses/names with an ellipsis at a given character limit.
 */
export function truncate(text, maxLength = 40) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}