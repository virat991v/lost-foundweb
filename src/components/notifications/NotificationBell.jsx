import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationsService } from '../../services/notifications/notificationsService'
import NotificationList from './NotificationList'

export default function NotificationBell() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [shaking, setShaking] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!user) return
    async function load() {
      const count = await notificationsService.getUnreadCount(user.id)
      setUnreadCount(count)
    }
    load()

    const channel = notificationsService.subscribeToNotifications(user.id, (payload) => {
      setNotifications((prev) => [payload.new, ...prev])
      setUnreadCount((c) => c + 1)
      // Shake bell on new notification
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    })
    return () => notificationsService.unsubscribe(channel)
  }, [user])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleOpen() {
    setOpen(!open)
    if (!open && user) {
      const data = await notificationsService.getByUser(user.id)
      setNotifications(data)
    }
  }

  async function handleMarkAllRead() {
    if (!user) return
    await notificationsService.markAllAsRead(user.id)
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-lg text-gray-400 hover:text-white
          hover:bg-[#1a1a1a] transition-all duration-200
          ${open ? 'text-white bg-[#1a1a1a]' : ''}
          ${shaking ? 'animate-bell-shake' : ''}`}
        aria-label="Notifications"
      >
        <Bell size={18} className="transition-transform duration-200 hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4F547] text-black text-[10px]
            font-bold rounded-full flex items-center justify-center animate-badge-pop">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-enter absolute right-0 top-11 w-80
          bg-[#141414]/95 backdrop-blur-xl
          border border-[#2a2a2a] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Glass top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]
            bg-gradient-to-r from-[#1a1a1a] to-[#161616]">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-[#D4F547]/20 text-[#D4F547] border border-[#D4F547]/30
                  px-1.5 py-0.5 rounded font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[#D4F547] text-xs hover:text-[#c8ee38] transition-colors duration-150
                  hover:underline underline-offset-2"
              >
                Mark all read
              </button>
            )}
          </div>
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  )
}
