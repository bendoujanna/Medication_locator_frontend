import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePolling } from '../../hooks/usePolling'
import { getClinicHoldRequests, processHoldRequest } from '../../api/holdRequestApi'
import HoldRequestCard from './components/HoldRequestCard'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { useToast } from '../../hooks/useToast'
import { RefreshCw } from 'lucide-react'

const TABS = ['All','Pending','Approved','Denied','Expired']

export default function HoldRequestsPage() {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('All')

  const { data, error } = usePolling(
    () => getClinicHoldRequests(clinicId, tab === 'All' ? undefined : tab.toUpperCase()),
    30000, [clinicId, tab]
  )

  const holds        = data?.results ?? []
  const pendingCount = data?.pending_count ?? 0

  const handle = async (hold, action) => {
    try {
      await processHoldRequest(clinicId, hold.request_id, action)
      showToast(action === 'APPROVE' ? 'Hold approved.' : 'Hold denied.', action === 'APPROVE' ? 'success' : 'warning')
    } catch (e) {
      showToast(e.response?.data?.error?.message || 'Action failed', 'error')
    }
  }

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold font-sans text-black">Hold Requests</h1>
        <div className="flex items-center gap-2 text-[12px] font-sans text-muted">
          <RefreshCw size={13} className="text-sage"/>
          Refreshes every 30 seconds
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`h-9 px-4 rounded-pill text-[13px] font-medium font-sans transition-colors
              ${tab===t ? 'bg-sage text-white' : 'bg-white border border-border text-sage hover:bg-sage-tint'}`}>
            {t}{t==='Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {!data && !error && <div className="flex justify-center py-16"><Spinner/></div>}
      {error && <p className="text-center text-sage py-16">Could not load hold requests.</p>}

      {data && holds.length === 0 && (
        <p className="text-center text-[14px] font-sans text-sage py-16">No hold requests found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {holds.map(h => (
          <HoldRequestCard key={h.request_id} hold={h}
            onApprove={hold => handle(hold, 'APPROVE')}
            onDeny={hold    => handle(hold, 'DENY')}/>
        ))}
      </div>
    </div>
  )
}
