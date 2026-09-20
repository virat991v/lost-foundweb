import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, CheckSquare,
  Flag, Activity, Settings, Search, LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin',          label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/admin/users',    label: 'User Management',  icon: Users },
  { to: '/admin/reports',  label: 'Reports & Items',  icon: FileText },
  { to: '/admin/claims',   label: 'Ownership Claims', icon: CheckSquare },
  { to: '/admin/flags',    label: 'Flags & Disputes', icon: Flag },
  { to: '/admin/activity', label: 'Activity Log',     icon: Activity },
  { to: '/admin/settings', label: 'System Settings',  icon: Settings },
]

export default function AdminSidebar() {
  const { logout, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = profile?.full_name?.[0]?.toUpperCase() ?? 'A'

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col min-h-screen relative">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4F547]/20 to-transparent" />

      {/* Logo */}
      <div className="p-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="w-8 h-8 bg-[#D4F547] rounded-lg flex items-center justify-center
            transition-all duration-250 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(212,245,71,0.35)]">
            <Search size={16} className="text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm">lost-found</span>
            <span className="text-[#D4F547] text-[9px] font-semibold tracking-widest uppercase">
              Campus Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }, idx) => {
          const isActive = end
            ? location.pathname === to
            : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={{ animationDelay: `${idx * 0.04}s` }}
              className={({ isActive: a }) =>
                `sidebar-item page-enter flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                group relative overflow-hidden
                ${a
                  ? 'active bg-[#D4F547] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive: a }) => (
                <>
                  {/* Background shimmer on hover */}
                  {!a && (
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0" />
                  )}
                  <Icon
                    size={16}
                    className={`flex-shrink-0 transition-all duration-200 relative z-10
                      ${a
                        ? 'text-black'
                        : 'group-hover:scale-110 group-hover:text-white'
                      }`}
                  />
                  <span className="relative z-10 truncate">{label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#1a1a1a]">
        {/* Profile chip */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-lg
          transition-colors duration-200 hover:bg-white/5 cursor-default group">
          <div className="w-7 h-7 rounded-full bg-[#D4F547] flex items-center justify-center
            text-black text-xs font-bold flex-shrink-0
            transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(212,245,71,0.3)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{profile?.full_name ?? 'Admin'}</p>
            <p className="text-gray-500 text-[10px] truncate">{profile?.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500
            hover:text-red-400 hover:bg-red-500/10
            transition-all duration-200 group"
        >
          <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
