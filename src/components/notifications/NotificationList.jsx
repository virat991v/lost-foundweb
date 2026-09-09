import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'

const typeIcons = {
  match_found: '🎯',
  claim_submitted: '📋',
  claim_approved: '✅',
  claim_rejected: '❌',
  verification_requested: '🔍',
  needs_admin_review: '⚠️',
  item_returned: '🎉',
  item_closed: '🔒',
  flag_action: '🚩',
  admin_action: '👤',
}

export default function NotificationList({ notifications = [] }) {
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <Bell size={24} className="mb-2 opacity-50" />
        <p className="text-sm">No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-3 border-b border-[#2a2a2a] last:border-0 hover:bg-[#222] transition-colors ${
            !n.is_read ? 'bg-[#D4F547]/5' : ''
          }`}
        >
          <div className="flex gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">
              {typeIcons[n.type] ?? '📢'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-snug">{n.title}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
              <p className="text-gray-600 text-xs mt-1">
                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
              </p>
            </div>
            {!n.is_read && (
              <div className="w-2 h-2 rounded-full bg-[#D4F547] mt-1.5 flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
