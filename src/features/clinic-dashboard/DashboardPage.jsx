import { useAuth } from '../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { getInventory } from '../../api/inventoryApi'
import { getAlerts } from '../../api/alertsApi'
import HoldRequestsInboxPanel from './HoldRequestsInboxPanel'
import StatusChip from '../../components/ui/StatusChip'

export default function DashboardPage() {
  const { staff, clinicId } = useAuth()
  const [summary, setSummary] = useState({ available:0, low:0, out:0 })
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    if (!clinicId) return
    getInventory(clinicId).then(d => {
      const r = d.results
      setSummary({
        available: r.filter(i => i.status === 'AVAILABLE').length,
        low:       r.filter(i => i.status === 'LOW_STOCK').length,
        out:       r.filter(i => i.status === 'OUT_OF_STOCK').length,
      })
    }).catch(() => {})
    getAlerts(clinicId, { is_resolved: false }).then(d => setAlertCount(d.unresolved_count)).catch(() => {})
  }, [clinicId])

  return (
    <div className="flex h-full">
      <div className="flex-1 p-7 overflow-y-auto">
        <h1 className="text-[22px] font-bold font-sans text-black mb-1">Dashboard</h1>
        <p className="text-[14px] font-sans text-sage mb-8">Welcome back, {staff?.full_name || staff?.username}.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:'In Stock',    value:summary.available, status:'AVAILABLE',    bg:'bg-status-available-bg', text:'text-status-available-text' },
            { label:'Low Stock',   value:summary.low,       status:'LOW_STOCK',    bg:'bg-status-low-bg',       text:'text-status-low-text'       },
            { label:'Out of Stock',value:summary.out,       status:'OUT_OF_STOCK', bg:'bg-status-out-bg',       text:'text-status-out-text'       },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`rounded-md p-5 ${bg}`}>
              <p className={`text-[32px] font-bold font-mono ${text}`}>{value}</p>
              <p className={`text-[13px] font-sans font-medium ${text} mt-1`}>{label}</p>
            </div>
          ))}
        </div>

        {alertCount > 0 && (
          <div className="bg-status-low-bg border-l-4 border-status-low rounded-md p-4 mb-6">
            <p className="text-[14px] font-semibold font-sans text-status-low-text">
              {alertCount} unresolved stock alert{alertCount > 1 ? 's' : ''}
            </p>
            <p className="text-[12px] font-sans text-status-low-text mt-1">
              Visit the Stock Alerts page to review and resolve them.
            </p>
          </div>
        )}

        <div className="bg-white border-[0.5px] border-border rounded-md shadow-card p-5">
          <p className="text-[15px] font-semibold font-sans text-black mb-1">Quick actions</p>
          <p className="text-[13px] font-sans text-sage">Use the sidebar to navigate to Inventory, Hold Requests, or Alerts.</p>
        </div>
      </div>
      <HoldRequestsInboxPanel/>
    </div>
  )
}