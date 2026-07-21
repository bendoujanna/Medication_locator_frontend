import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { usePolling } from '../../hooks/usePolling'
import { getClinicHoldRequests } from '../../api/holdRequestApi'
import { getAlerts } from '../../api/alertsApi'

export default function ClinicLayout() {
  const { clinicId } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const { data: holdsData }  = usePolling(
    () => getClinicHoldRequests(clinicId, 'PENDING'),
    30000, [clinicId]
  )
  const { data: alertsData } = usePolling(
    () => getAlerts(clinicId, { is_resolved: false }),
    60000, [clinicId]
  )

  const holdCount  = holdsData?.pending_count  ?? 0
  const alertCount = alertsData?.unresolved_count ?? 0

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar holdCount={holdCount} alertCount={alertCount} collapsed={collapsed}/>
      <main className="flex-1 overflow-y-auto scrollbar-sage">
        <Outlet context={{ holdCount, alertCount }}/>
      </main>
    </div>
  )
}
