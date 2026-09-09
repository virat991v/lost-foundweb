const variants = {
  active: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  active_case: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  pending: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  pending_claim: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  matched: 'bg-[#D4F547]/20 text-[#D4F547] border border-[#D4F547]/30',
  resolved: 'bg-green-500 text-black',
  disputed: 'border border-red-500 text-red-400',
  flagged: 'bg-red-500/20 text-red-400 border border-red-500/30',
  under_review: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  in_verification: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  under_verification: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  verification: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  open: 'border border-gray-500/50 text-gray-400',
  new: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
  lost: 'bg-red-500/20 text-red-400 border border-red-500/30',
  found: 'bg-green-500/20 text-green-400 border border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  approved: 'bg-green-500 text-black',
  rejected: 'border border-red-500 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  needs_admin_review: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  suspended: 'bg-red-500/20 text-red-400 border border-red-500/30',
  student: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  admin: 'bg-[#D4F547]/20 text-[#D4F547] border border-[#D4F547]/30',
}

const LABELS = {
  active: 'Active',
  active_case: 'Active Case',
  pending: 'Pending',
  pending_claim: 'Pending Claim',
  matched: 'Matched',
  resolved: 'Resolved',
  disputed: 'Disputed',
  flagged: 'Flagged',
  under_review: 'Under Review',
  in_verification: 'In Verification',
  under_verification: 'In Verification',
  verification: 'In Verification',
  open: 'Open',
  new: 'New',
  lost: 'Lost',
  found: 'Found',
  closed: 'Closed',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  needs_admin_review: 'Admin Review',
  suspended: 'Suspended',
  student: 'Student',
  admin: 'Admin',
}

export default function Badge({ status, label, className = '' }) {
  const key = (status ?? '').toLowerCase().replace(/\s+/g, '_')
  const cls = variants[key] ?? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  const text = label ?? LABELS[key] ?? status ?? ''

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${cls} ${className}`}
    >
      {text}
    </span>
  )
}
