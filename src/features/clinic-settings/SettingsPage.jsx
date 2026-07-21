import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import FacilityProfileCard from './components/FacilityProfileCard'
import StaffAccountsCard from './components/StaffAccountsCard'
import ThresholdsCard from './components/ThresholdsCard'

export default function SettingsPage() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return (
    <div className="p-7 max-w-[1100px]">
      <h1 className="text-[22px] font-bold font-sans text-black mb-6">Settings</h1>
      <div className="flex flex-col gap-5">
        <FacilityProfileCard />
        <StaffAccountsCard />
        <ThresholdsCard />
      </div>
    </div>
  )
}
