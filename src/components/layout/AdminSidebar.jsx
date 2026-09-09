import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Flag,
  Activity,
  Settings,
  Search,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/reports', label: 'Reports & Items', icon: FileText },
  { to: '/admin/claims', label: 'Ownership Claims', icon: CheckSquare },
  { to: '/admin/flags', label: 'Flags & Disputes', icon: Flag },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  { to: '/admin/settings', label: 'System Settings', icon: Settings },
]

export default function AdminSidebar() {
  const { logout, profile } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-[#111111] border-r border-[#1a1a1a] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#D4F547] rounded-lg flex items-center justify-center">
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
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#D4F547] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-[#D4F547] flex items-center justify-center text-black text-xs font-bold">
            {profile?.full_name?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{profile?.full_name ?? 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
