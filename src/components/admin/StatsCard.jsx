import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ label, value, trend, trendLabel, icon: Icon, subtitle }) {
  const isPositive = trend > 0

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-[#D4F547]/10 flex items-center justify-center">
            <Icon size={18} className="text-[#D4F547]" />
          </div>
        )}
      </div>

      {subtitle && <p className="text-gray-500 text-xs mb-2">{subtitle}</p>}

      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-green-400" />
          ) : (
            <TrendingDown size={13} className="text-red-400" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{trend}% {trendLabel ?? 'vs last month'}
          </span>
        </div>
      )}
    </div>
  )
}
