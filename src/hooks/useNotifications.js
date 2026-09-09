import { useState, useEffect, useCallback } from 'react'
import { notificationsService } from '../services/notifications/notificationsService'

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const [data, count] = await Promise.all([
      notificationsService.getByUser(userId),
      notificationsService.getUnreadCount(userId),
    ])
    setNotifications(data ?? [])
    setUnreadCount(count)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
    if (!userId) return
    const channel = notificationsService.subscribeToNotifications(userId, (payload) => {
      setNotifications((prev) => [payload.new, ...prev])
      setUnreadCount((c) => c + 1)
    })
    return () => notificationsService.unsubscribe(channel)
  }, [userId, load])

  async function markAllRead() {
    if (!userId) return
    await notificationsService.markAllAsRead(userId)
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return { notifications, unreadCount, loading, refetch: load, markAllRead }
}
