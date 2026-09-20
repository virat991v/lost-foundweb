import { useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import useCountUp from '../../hooks/useCountUp'

function AnimatedValue({ value }) {
  const animated = useCountUp(value, 1200)
  return <span className="animate-count-in">{animated}</span>
}

export default function StatsCard({ label, value, trend, trendLabel, icon: Icon, subtitle }) {
  const isPositive = trend > 0
  const cardRef = useRef(null)

  // Spotlight mouse-follow effect
  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="card-hover card-spotlight group
        bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5
        hover:border-[#3a3a3a] cursor-default"
    >
      {/* Inner content above the spotlight overlay */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1
              transition-colors duration-200 group-hover:text-gray-400">
              {label}
            </p>
            <p className="text-3xl font-bold text-white tabular-nums">
              <AnimatedValue value={value} />
            </p>
          </div>
          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-[#D4F547]/10 flex items-center justify-center
              transition-all duration-250 group-hover:bg-[#D4F547]/20 group-hover:scale-110
              group-hover:shadow-[0_0_16px_rgba(212,245,71,0.2)]">
              <Icon size={18} className="text-[#D4F547] transition-transform duration-200 group-hover:scale-110" />
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-gray-500 text-xs mb-2 transition-colors duration-200 group-hover:text-gray-400">
            {subtitle}
          </p>
        )}

        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp size={13} className="text-green-400 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <TrendingDown size={13} className="text-red-400 transition-transform duration-200 group-hover:scale-110" />
            )}
            <span className={`text-xs font-medium transition-colors duration-200 ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? '+' : ''}{trend}% {trendLabel ?? 'vs last month'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
