import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'

export default function RecentActivity({ logs = [] }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
      <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center gap-2">
        <Activity size={16} className="text-[#D4F547]" />
        <h3 className="text-white font-semibold text-sm">Recent Activity & Reports</h3>
      </div>

      {!logs.length ? (
        <div className="p-8 text-center text-gray-500 text-sm">No recent activity</div>
      ) : (
        <div className="divide-y divide-[#1f1f1f]">
          {logs.map((log) => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-[#1f1f1f] transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#D4F547] mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{log.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {log.profiles?.full_name && (
                    <span className="text-gray-500 text-xs">{log.profiles.full_name}</span>
                  )}
                  <span className="text-gray-600 text-xs">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
