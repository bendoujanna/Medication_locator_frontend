import { Search, MapPin, Clock } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to:'/',        icon:Search, label:'Search' },
  { to:'/map',     icon:MapPin,  label:'Map'    },
  { to:'/history', icon:Clock,   label:'History' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t-[0.5px] border-border grid grid-cols-3 z-20">
      {ITEMS.map(({ to, icon:Icon, label }) => (
        <NavLink key={to} to={to} end className="flex flex-col items-center justify-center gap-1 relative">
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute top-0 left-0 right-0 h-[3px] bg-rose rounded-b-sm"/>}
              <Icon size={22} className={isActive?'text-sage':'text-muted'} strokeWidth={isActive?2.5:2}/>
              <span className={`text-[11px] font-sans ${isActive?'font-semibold text-sage':'font-normal text-muted'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
