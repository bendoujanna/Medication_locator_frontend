// import { Outlet, Link, NavLink } from 'react-router-dom'
// import { MapPin, Search, Clock } from 'lucide-react'
// import BottomNav from './BottomNav'
// import { useGeolocation } from '../../hooks/useGeolocation'
//
// export default function ClientLayout() {
//   const { status } = useGeolocation()
//   const denied = status === 'denied'
//
//   return (
//     <div className="h-screen bg-cream flex flex-col overflow-hidden relative">
//
//       {/*<header className="flex items-center justify-between h-[52px] px-5 flex-shrink-0 bg-white border-b-[0.5px] border-border z-20 relative">*/}
//       <header className="flex items-center justify-between h-[52px] px-5 flex-shrink-0 bg-cream border-b-[0.5px] border-border z-20 relative">
//         <span className="text-[16px] font-bold font-sans text-rose">MedLocator</span>
//
//         <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
//            <NavLink to="/" end className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>
//              <Search size={16}/> Search
//            </NavLink>
//            <NavLink to="/map" className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>
//              <MapPin size={16}/> Map
//            </NavLink>
//            {/*<NavLink to="/history" className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>*/}
//            {/*  <Clock size={16}/> History*/}
//            {/*</NavLink>*/}
//         </div>
//
//         <div className="flex items-center gap-3">
//           <span className={`flex items-center gap-1 h-7 px-3 rounded-pill text-[11px] font-medium font-sans
//             ${denied ? 'bg-status-low-bg border border-status-low text-status-low-text'
//                      : 'bg-rose-tint border border-rose-light text-rose-dark'}`}>
//             <MapPin size={12}/>
//             {denied ? '⚠ Location off' : '📍 Kigali, Rwanda'}
//           </span>
//           <Link to="/login" className="text-[12px] font-medium font-sans text-sage underline">
//             Staff
//           </Link>
//         </div>
//       </header>
//
//       <main className="flex-1 flex flex-col pb-[88px] md:pb-0 relative">
//         <Outlet/>
//       </main>
//
//       <div className="md:hidden">
//         <BottomNav/>
//       </div>
//     </div>
//   )
// }



import { Outlet, Link, NavLink } from 'react-router-dom'
import { MapPin, Search, Clock } from 'lucide-react'
import BottomNav from './BottomNav'
import { useGeolocation } from '../../hooks/useGeolocation'

export default function ClientLayout() {
  const { status } = useGeolocation()
  const denied = status === 'denied'

  return (
    <div className="h-screen bg-cream flex flex-col overflow-hidden relative">
      <header className="flex items-center justify-between h-[52px] px-5 flex-shrink-0 bg-cream border-b-[0.5px] border-border z-20 relative">
        <span className="text-[16px] font-bold font-sans text-rose">MedLocator</span>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
           <NavLink to="/" end className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>
             <Search size={16}/> Search
           </NavLink>
           <NavLink to="/map" className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>
             <MapPin size={16}/> Map
           </NavLink>

           {/* Your simple nav link redirecting to the tracking page */}
           <NavLink to="/track" className={({isActive}) => `text-[13px] font-medium font-sans flex items-center gap-2 transition-colors ${isActive ? 'text-sage font-semibold' : 'text-muted hover:text-sage'}`}>
             <Clock size={16}/> Track Hold
           </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 h-7 px-3 rounded-pill text-[11px] font-medium font-sans
            ${denied ? 'bg-status-low-bg border border-status-low text-status-low-text'
                     : 'bg-rose-tint border border-rose-light text-rose-dark'}`}>
            <MapPin size={12}/>
            {denied ? '⚠ Location off' : '📍 Kigali, Rwanda'}
          </span>
          <Link to="/login" className="text-[12px] font-medium font-sans text-sage underline">
            Staff
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col pb-[88px] md:pb-0 relative">
        <Outlet/>
      </main>

      <div className="md:hidden">
        <BottomNav/>
      </div>
    </div>
  )
}