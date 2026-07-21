const FILL = { AVAILABLE:'bg-status-available', LOW_STOCK:'bg-status-low', OUT_OF_STOCK:'bg-status-out' }
export default function ProgressBar({ status, quantity, referenceMax=50, className='' }) {
  const pct = Math.min(100, Math.round((quantity / referenceMax) * 100))
  return (
    <div className={`h-[5px] w-full bg-sage-tint rounded-pill overflow-hidden ${className}`}>
      <div className={`h-full rounded-pill transition-all ${FILL[status]}`} style={{ width:`${pct}%` }}/>
    </div>
  )
}
