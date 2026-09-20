import { AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Button from '../ui/Button'

export default function NeedsAttention({ flags = [], onResolve }) {
  return (
    <div className="card-hover bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center gap-2">
        <AlertTriangle
          size={16}
          className="text-orange-400 transition-transform duration-200 hover:scale-110"
        />
        <h3 className="text-white font-semibold text-sm">Needs Attention</h3>
        {flags.length > 0 && (
          <span className="ml-auto text-xs bg-red-500/20 text-red-400 border border-red-500/30
            px-2 py-0.5 rounded animate-badge-pop">
            {flags.length} flagged
          </span>
        )}
      </div>

      {!flags.length ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No items need attention right now
        </div>
      ) : (
        <div className="divide-y divide-[#1a1a1a]">
          {flags.map((flag, idx) => (
            <div
              key={flag.id}
              className="animate-row-enter p-4 flex flex-col gap-2 group
                hover:bg-white/[0.025] transition-colors duration-150"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm font-medium transition-colors duration-150 group-hover:text-white/90">
                  {flag.reason?.replace(/_/g, ' ')}
                </p>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30
                  px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0
                  transition-all duration-200 group-hover:bg-red-500/30">
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
                  className="text-xs hover:text-green-400 hover:bg-green-500/10 transition-colors duration-200"
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
