import { INVENTORY_STATUS, INVENTORY_STATUS_LABEL } from '../../utils/constants'

const STYLE = {
  AVAILABLE:    { bg:'bg-status-available-bg', text:'text-status-available-text', dot:'bg-status-available' },
  LOW_STOCK:    { bg:'bg-status-low-bg',       text:'text-status-low-text',       dot:'bg-status-low' },
  OUT_OF_STOCK: { bg:'bg-status-out-bg',       text:'text-status-out-text',       dot:'bg-status-out' },
}

export default function StatusChip({ status, size='md', className='' }) {
  const s = STYLE[status]
  if (!s) return null
  const sz = size === 'sm' ? 'h-[24px] px-2.5 text-[10px] gap-1' : 'h-[26px] px-2.5 text-[11px] gap-1.5'
  return (
    <span className={`inline-flex items-center rounded-pill font-sans font-medium ${s.bg} ${s.text} ${sz} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {INVENTORY_STATUS_LABEL[status]}
    </span>
  )
}
