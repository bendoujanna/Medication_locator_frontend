import { useAuth } from '../../hooks/useAuth'
import { usePolling } from '../../hooks/usePolling'
import { getClinicHoldRequests, processHoldRequest } from '../../api/holdRequestApi'
import HoldRequestCard from './components/HoldRequestCard'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { useToast } from '../../hooks/useToast'

export default function HoldRequestsInboxPanel() {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()

  const { data, error } = usePolling(
    () => getClinicHoldRequests(clinicId),
    30000, [clinicId]
  )

  const holds         = data?.results ?? []
  const pendingCount  = data?.pending_count ?? 0

  const handle = async (hold, action) => {
    try {
      await processHoldRequest(clinicId, hold.request_id, action)
      showToast(action === 'APPROVE' ? 'Hold approved — stock decremented.' : 'Hold denied.', action === 'APPROVE' ? 'success' : 'warning')
    } catch (e) {
      showToast(e.response?.data?.error?.message || 'Action failed', 'error')
    }
  }

  return (
    <div className="w-[300px] flex-shrink-0 bg-white border-l border-border h-full overflow-y-auto scrollbar-sage p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[15px] font-semibold font-sans text-black">Hold Requests</span>
        <Badge count={pendingCount}/>
      </div>
      <p className="text-[11px] font-sans text-muted mb-4">Refreshes every 30 seconds</p>
      <div className="h-px bg-border mb-4"/>

      {!data && !error && <div className="flex justify-center py-8"><Spinner/></div>}
      {error && <p className="text-[13px] font-sans text-muted text-center py-8">Could not load holds.</p>}

      <div className="flex flex-col gap-2.5">
        {holds.map(h => (
          <HoldRequestCard key={h.request_id} hold={h}
            onApprove={hold => handle(hold, 'APPROVE')}
            onDeny={hold    => handle(hold, 'DENY')}/>
        ))}
        {holds.length === 0 && data && (
          <p className="text-[13px] font-sans text-muted text-center py-8">No hold requests yet.</p>
        )}
      </div>
    </div>
  )
}