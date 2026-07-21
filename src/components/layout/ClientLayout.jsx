import { Outlet } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import BottomNav from './BottomNav'
import { useGeolocation } from '../../hooks/useGeolocation'

export default function ClientLayout() {
  const { status } = useGeolocation()
  const denied = status === 'denied'
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="flex items-center justify-between h-[52px] px-5 flex-shrink-0">
        <span className="text-[16px] font-bold font-sans text-rose">MedLocator</span>
        <span className={`flex items-center gap-1 h-7 px-3 rounded-pill text-[11px] font-medium font-sans
          ${denied ? 'bg-status-low-bg border border-status-low text-status-low-text'
                   : 'bg-rose-tint border border-rose-light text-rose-dark'}`}>
          <MapPin size={12}/>
          {denied ? '⚠ Location off' : '📍 Kigali, Rwanda'}
        </span>
      </header>
      <main className="flex-1 pb-[88px]"><Outlet/></main>
      <BottomNav/>
    </div>
  )
}
