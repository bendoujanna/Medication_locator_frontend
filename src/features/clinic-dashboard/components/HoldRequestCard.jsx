import { timeAgo } from '../../../utils/formatters'
import { formatCountdown } from '../../../utils/formatters'
import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function HoldRequestCard({ hold, onApprove, onDeny }) {
  const [msLeft, setMsLeft] = useState(0)
  const isApproved = hold.status === 'APPROVED'
  const isPending  = hold.status === 'PENDING'

  useEffect(() => {
    if (!isPending) return
    const tick = () => setMsLeft(new Date(hold.expires_at).getTime() - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hold.expires_at, isPending])

  return (
    <div className="bg-white border-[0.5px] border-border rounded-md shadow-card p-3 flex flex-col gap-2.5">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-semibold font-sans text-black">{hold.medication_name}</p>
        <span className="text-[11px] font-sans text-muted">{timeAgo(hold.requested_at)}</span>
      </div>
      <p className="text-[12px] font-mono text-sage">{hold.patient_contact_masked}</p>
      <p className="text-[11px] font-sans text-muted">{hold.dosage_label}</p>

      {isApproved ? (
        <div className="flex items-center gap-1.5 mt-1">
          <CheckCircle2 size={14} className="text-status-available"/>
          <span className="text-[12px] font-sans text-status-available">
            Unit reserved — expires in <span className="font-mono">{formatCountdown(msLeft)}</span>
          </span>
        </div>
      ) : isPending ? (
        <div className="flex gap-2 mt-1">
          <button onClick={() => onApprove(hold)}
            className="flex-1 h-[34px] rounded-sm bg-rose text-white text-[12px] font-semibold font-sans">
            Approve
          </button>
          <button onClick={() => onDeny(hold)}
            className="flex-1 h-[34px] rounded-sm border-[1.5px] border-status-out text-status-out text-[12px] font-semibold font-sans">
            Deny
          </button>
        </div>
      ) : null}
    </div>
  )
}
