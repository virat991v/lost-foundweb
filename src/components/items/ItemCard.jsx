import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge'
import { getCategoryLabel, getLocationLabel } from '../../utils/constants'
import { format } from 'date-fns'

export default function ItemCard({ item, type = 'lost' }) {
  const date = item.lost_date || item.found_date
  const formattedDate = date ? format(new Date(date), 'MMM d, yyyy') : ''
  const detailPath = `/items/${type}/${item.id}`
  const isLost = type === 'lost'

  return (
    <div className="
      card-hover group
      bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden flex flex-col
      hover:border-[#3a3a3a]
    ">
      {/* Photo */}
      <div className="relative h-44 bg-[#111111] flex items-center justify-center overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-700 transition-colors duration-200 group-hover:text-gray-600">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs">No photo</span>
          </div>
        )}

        {/* Status badge top-right */}
        <div className="absolute top-2 right-2">
          <Badge status={item.status} />
        </div>

        {/* RETURNED stamp overlay */}
        {item.status === 'returned' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="border-4 border-green-400 rounded-lg px-4 py-2 rotate-[-15deg]">
              <p className="text-green-400 font-black text-xl tracking-widest uppercase">
                Returned
              </p>
            </div>
          </div>
        )}

        {/* Lost / Found type badge top-left */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-200 ${
            isLost
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30 group-hover:bg-green-500/30'
          }`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-white/90">
            {item.title}
          </h3>
          <span className="text-[10px] text-gray-500 shrink-0 bg-[#0a0a0a] px-2 py-0.5 rounded border border-[#2a2a2a] transition-colors duration-200 group-hover:border-[#3a3a3a]">
            {getCategoryLabel(item.category)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs transition-colors duration-200 group-hover:text-gray-400">
            <MapPin size={12} className="flex-shrink-0" />
            <span>{getLocationLabel(item.campus_location)}</span>
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs transition-colors duration-200 group-hover:text-gray-400">
              <Calendar size={12} className="flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Link
            to={detailPath}
            className="
              flex items-center justify-center gap-2 w-full
              border border-[#2a2a2a] text-white text-sm py-2 rounded-lg
              hover:bg-[#222] hover:border-[#3a3a3a]
              transition-all duration-200
              group/btn
            "
          >
            View Details
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
