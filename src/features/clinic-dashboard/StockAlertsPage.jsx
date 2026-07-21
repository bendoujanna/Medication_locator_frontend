import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getAlerts, resolveAlert } from '../../api/alertsApi'
import { useToast } from '../../hooks/useToast'
import Spinner from '../../components/ui/Spinner'
import { timeAgo } from '../../utils/formatters'

export default function StockAlertsPage() {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()
  const [alerts,   setAlerts]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('unresolved')

  const load = useCallback(async () => {
    if (!clinicId) return
    try {
      const params = filter === 'unresolved' ? { is_resolved: false } : {}
      const data = await getAlerts(clinicId, params)
      setAlerts(data.results)
    } catch { showToast('Failed to load alerts', 'error') }
    finally { setLoading(false) }
  }, [clinicId, filter])

  useEffect(() => { load() }, [load])

  const handleResolve = async (alertId) => {
    try {
      await resolveAlert(clinicId, alertId)
      showToast('Alert marked as resolved.', 'success')
      load()
    } catch (e) {
      showToast(e.response?.data?.error?.message || 'Failed to resolve', 'error')
    }
  }

  const unresolvedCount = alerts.filter(a => !a.is_resolved).length

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-bold font-sans text-black">Stock Alerts</h1>
        {unresolvedCount > 0 && (
          <span className="h-7 px-3 rounded-pill bg-status-low-bg text-status-low-text text-[12px] font-semibold font-sans flex items-center gap-1.5">
            <Bell size={12}/> {unresolvedCount} unresolved
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {[['unresolved','Unresolved'],['all','All alerts']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`h-9 px-4 rounded-pill text-[13px] font-medium font-sans
              ${filter===val ? 'bg-sage text-white' : 'bg-white border border-border text-sage hover:bg-sage-tint'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner/></div>}
      {!loading && alerts.length === 0 && (
        <p className="text-center text-[14px] font-sans text-sage py-16">No alerts found.</p>
      )}

      <div className="flex flex-col gap-3">
        {alerts.map(alert => (
          <div key={alert.alert_id}
            className={`bg-white border-[0.5px] rounded-md shadow-card p-4 flex items-center gap-4
              border-l-4 ${alert.alert_type==='OUT_OF_STOCK' ? 'border-l-status-out border-border' : 'border-l-status-low border-border'}
              ${alert.is_resolved ? 'opacity-55' : ''}`}>
            {/* Icon */}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
              ${alert.alert_type==='OUT_OF_STOCK' ? 'bg-status-out-bg' : 'bg-status-low-bg'}`}>
              <Bell size={20} className={alert.alert_type==='OUT_OF_STOCK' ? 'text-status-out-text' : 'text-status-low-text'}/>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-semibold font-sans text-black">{alert.medication_name}</p>
                <span className={`h-[22px] px-2 rounded-pill text-[10px] font-medium font-sans
                  ${alert.alert_type==='OUT_OF_STOCK' ? 'bg-status-out-bg text-status-out-text' : 'bg-status-low-bg text-status-low-text'}`}>
                  {alert.alert_type === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock'}
                </span>
              </div>
              <p className="text-[12px] font-sans text-sage mt-0.5">
                Triggered when stock dropped to{' '}
                <span className="font-mono">{alert.quantity_at_trigger}</span> units
                {' '}(threshold: <span className="font-mono">{alert.low_stock_threshold}</span>)
              </p>
              <p className="text-[11px] font-sans text-muted mt-0.5">
                {alert.is_resolved ? `Resolved` : timeAgo(alert.triggered_at)}
              </p>
            </div>

            {/* Action */}
            {!alert.is_resolved ? (
              <button onClick={() => handleResolve(alert.alert_id)}
                className="flex-shrink-0 h-9 px-4 rounded-sm border-[1.5px] border-sage text-sage text-[12px] font-semibold font-sans hover:bg-sage-tint">
                Mark resolved
              </button>
            ) : (
              <CheckCircle2 size={20} className="text-status-available flex-shrink-0"/>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
