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
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4F547] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[#D4F547] text-xs hover:underline"
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
