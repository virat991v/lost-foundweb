import { AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Button from '../ui/Button'

export default function NeedsAttention({ flags = [], onResolve }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
      <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center gap-2">
        <AlertTriangle size={16} className="text-orange-400" />
        <h3 className="text-white font-semibold text-sm">Needs Attention</h3>
        {flags.length > 0 && (
          <span className="ml-auto text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
            {flags.length} flagged
          </span>
        )}
      </div>

      {!flags.length ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No items need attention right now
        </div>
      ) : (
        <div className="divide-y divide-[#1f1f1f]">
          {flags.map((flag) => (
            <div key={flag.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm font-medium">{flag.reason?.replace(/_/g, ' ')}</p>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">
                  urgent
                </span>
              </div>
              {flag.description && (
                <p className="text-gray-400 text-xs leading-relaxed">{flag.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">
                  {formatDistanceToNow(new Date(flag.created_at), { addSuffix: true })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResolve?.(flag.id)}
                  className="text-xs"
                >
                  Resolve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
