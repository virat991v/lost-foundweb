/**
 * Skeleton shimmer loader components.
 * Drop-in replacement for cards during loading states.
 */

function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function SkeletonStatsCard() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function SkeletonItemCard() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-9 w-full mt-1" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="px-5 py-4 flex items-center gap-4 border-b border-[#1f1f1f]">
      <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="h-2.5 w-2/5" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 ${i === 1 ? 'w-24' : i === 2 ? 'w-32' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  )
}

export default Skeleton
