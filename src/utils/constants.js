export const INVENTORY_STATUS = {
  AVAILABLE:    'AVAILABLE',
  LOW_STOCK:    'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
}

export const INVENTORY_STATUS_LABEL = {
  AVAILABLE:    'In Stock',
  LOW_STOCK:    'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
}

export const HOLD_STATUS = {
  PENDING:  'PENDING',
  APPROVED: 'APPROVED',
  DENIED:   'DENIED',
  EXPIRED:  'EXPIRED',
}

export const STAFF_ROLE = {
  ADMINISTRATOR:       'ADMINISTRATOR',
  STANDARD_PHARMACIST: 'STANDARD_PHARMACIST',
}

export const STAFF_ROLE_LABEL = {
  ADMINISTRATOR:       'Administrator',
  STANDARD_PHARMACIST: 'Standard Pharmacist',
}

export const HOLD_DURATION_MS = 2 * 60 * 60 * 1000
export const POLL_INTERVAL_MS  = 30000
