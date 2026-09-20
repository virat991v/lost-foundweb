import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

function Logo({ admin = false }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 bg-[#D4F547] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-250 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(212,245,71,0.3)]">
        <Search size={16} className="text-black" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-white font-bold text-sm tracking-tight">lost-found</span>
        {admin && <span className="text-[#D4F547] text-[10px] font-semibold tracking-widest uppercase">Campus Admin</span>}
      </div>
    </div>
  )
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/browse', label: 'Browse Items' },
  { to: '/my-claims', label: 'My Claims' },
  { to: '/report-lost', label: 'Submit Report' },
]

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a] transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4F547]/50 rounded-lg">
          <Logo />
        </Link>

        {/* Desktop Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-[#D4F547] bg-[#D4F547]/10 active'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-[#D4F547] text-black text-xs font-bold flex items-center justify-center
                    transition-all duration-200 hover:scale-110 hover:shadow-[0_0_12px_rgba(212,245,71,0.35)]
                    active:scale-95"
                  aria-label="User menu"
                >
                  {initials}
                </button>
                {userMenuOpen && (
                  <div className="dropdown-enter absolute right-0 top-10 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#2a2a2a]">
                      <p className="text-white text-sm font-medium truncate">{profile?.full_name}</p>
                      <p className="text-gray-500 text-xs truncate">{profile?.email}</p>
                    </div>
                    <div className="py-1">
                      {profile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white transition-colors duration-150"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#222] hover:text-red-300 transition-colors duration-150"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 text-sm hover:text-white transition-colors duration-200 px-2 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="border border-[#2a2a2a] text-white text-sm px-4 py-1.5 rounded-lg
                  hover:bg-[#1a1a1a] hover:border-[#3a3a3a]
                  transition-all duration-200 btn-ripple"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="transition-transform duration-200 block">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-1 animate-slide-down">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${i * 0.05}s` }}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4F547] bg-[#D4F547]/10'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export { Logo }
