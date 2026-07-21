export function isValidE164Phone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

export function isStrongPassword(p) {
  return p.length >= 10 && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)
}

export function passwordError(p) {
  if (p.length < 10)          return 'At least 10 characters'
  if (!/[A-Z]/.test(p))      return 'Add one uppercase letter'
  if (!/\d/.test(p))         return 'Add one number'
  if (!/[^A-Za-z0-9]/.test(p)) return 'Add one special character'
  return null
}