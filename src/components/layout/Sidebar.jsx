import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, Bell, Settings, Lock } from 'lucide-react'
import Badge from '../ui/Badge'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ holdCount=0, alertCount=0, collapsed=false }) {
  const { staff, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const NAV = [
    { to:'/dashboard',          icon:LayoutDashboard, label:'Dashboard'      },
    { to:'/dashboard/inventory', icon:Package,          label:'Inventory'      },
    { to:'/dashboard/holds',     icon:ClipboardList,    label:'Hold Requests', badge:holdCount  },
    { to:'/dashboard/alerts',    icon:Bell,             label:'Stock Alerts',  dot:alertCount>0 },
    { to:'/dashboard/settings',  icon:Settings,         label:'Settings',      adminOnly:true   },
  ]

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <aside className={`bg-sage flex flex-col ${collapsed?'w-[72px]':'w-[220px]'} flex-shrink-0 h-screen sticky top-0`}>
      <div className="px-4 pt-5 pb-3 border-b border-white/20">
        {collapsed
          ? <div className="w-9 h-9 rounded-md bg-white/15 flex items-center justify-center text-white font-bold text-sm">M</div>
          : <>
              <p className="text-white font-bold text-[15px] font-sans">MedLocator</p>
              <p className="text-white/60 text-[11px] font-sans mt-0.5 truncate">{staff?.clinic?.name}</p>
            </>
        }
      </div>

      <nav className="flex flex-col gap-1 px-2 pt-3 flex-1">
        {NAV.map(({ to, icon:Icon, label, badge, dot, adminOnly }) => {
          if (adminOnly && !isAdmin) return (
            <div key={to} className="flex items-center gap-2.5 h-[38px] px-3 opacity-40 cursor-not-allowed rounded-sm">
              <Lock size={16} className="text-white/60 flex-shrink-0"/>
              {!collapsed && <span className="text-white/60 text-[13px] font-sans">{label}</span>}
            </div>
          )
          return (
            <NavLink key={to} to={to} end={to==='/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 h-[38px] px-3 rounded-sm transition-colors
                ${isActive ? 'bg-white/13 text-white font-semibold' : 'text-white/60 hover:bg-white/8'}`}>
              <Icon size={16} className="flex-shrink-0"/>
              {!collapsed && <span className="text-[13px] font-sans flex-1">{label}</span>}
              {badge > 0 && <Badge count={badge}/>}
              {dot && !badge && <span className="w-2 h-2 rounded-full bg-status-low flex-shrink-0"/>}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-md p-3 bg-rose/20 border border-rose/40">
          {!collapsed && <>
            <p className="text-white font-semibold text-[12px] font-sans">{staff?.full_name || staff?.username}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-pill bg-rose/30 text-white/80 text-[10px] font-sans">
              {staff?.role_label}
            </span>
          </>}
          <button onClick={handleLogout}
            className={`text-white/45 text-[11px] font-sans hover:text-white/70 transition-colors ${collapsed?'':'mt-2 block'}`}>
            {collapsed ? '↩' : 'Sign out'}
          </button>
        </div>
      </div>
    </aside>
  )
}