// ============================================================
// Application-wide constants
// ============================================================

export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'bags', label: 'Bags & Backpacks' },
  { value: 'keys', label: 'Keys' },
  { value: 'books', label: 'Books & Stationery' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'documents', label: 'Documents & IDs' },
  { value: 'bottles', label: 'Bottles & Containers' },
  { value: 'other', label: 'Other' },
]

export const CAMPUS_LOCATIONS = [
  { value: 'main_gate', label: 'Main Gate' },
  { value: 'library', label: 'Library' },
  { value: 'canteen', label: 'Canteen / Cafeteria' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'hostel', label: 'Hostel / Dormitory' },
  { value: 'parking', label: 'Parking Area' },
  { value: 'sports_ground', label: 'Sports Ground' },
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'office', label: 'Administrative Office' },
  { value: 'corridor', label: 'Corridor / Hallway' },
  { value: 'other', label: 'Other' },
]

export const ITEM_STATUSES = {
  active: { label: 'Active', color: 'text-orange-400 bg-orange-500/20 border border-orange-500/30' },
  matched: { label: 'Matched', color: 'text-[#D4F547] bg-[#D4F547]/20 border border-[#D4F547]/30' },
  verification: { label: 'In Verification', color: 'text-blue-400 bg-blue-500/20 border border-blue-500/30' },
  returned: { label: 'Returned', color: 'text-black bg-green-500' },
  closed: { label: 'Closed', color: 'text-gray-400 border border-gray-500/30' },
}

export const CLAIM_STATUSES = {
  pending: { label: 'Pending', color: 'text-purple-400 bg-purple-500/20 border border-purple-500/30' },
  under_verification: { label: 'In Verification', color: 'text-blue-400 bg-blue-500/20 border border-blue-500/30' },
  approved: { label: 'Approved', color: 'text-black bg-green-500' },
  rejected: { label: 'Rejected', color: 'text-red-400 border border-red-500/30' },
  needs_admin_review: { label: 'Admin Review', color: 'text-orange-400 bg-orange-500/20 border border-orange-500/30' },
  cancelled: { label: 'Cancelled', color: 'text-gray-400 border border-gray-500/30' },
}

export const FLAG_STATUSES = {
  open: { label: 'Open', color: 'text-gray-400 border border-gray-500/30' },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-500/20 border border-blue-500/30' },
  resolved: { label: 'Resolved', color: 'text-black bg-green-500' },
  dismissed: { label: 'Dismissed', color: 'text-gray-400 border border-gray-500/30' },
}

export const FLAG_REASONS = [
  { value: 'fake_report', label: 'Fake Report' },
  { value: 'spam', label: 'Spam' },
  { value: 'suspicious_claim', label: 'Suspicious Claim' },
  { value: 'wrong_information', label: 'Wrong Information' },
  { value: 'other', label: 'Other' },
]

export const PAGINATION_LIMIT = 12

export const STORAGE_BUCKETS = {
  ITEM_PHOTOS: 'item-photos',
  PROOF_DOCUMENTS: 'proof-documents',
  AVATARS: 'avatars',
}

export const REPORT_LOST_STEPS = [
  'Item Details',
  'Location & Time',
  'Photos',
  'Review & Submit',
]

export const REPORT_FOUND_STEPS = [
  'Item Details',
  'Location & Time',
  'Photos',
  'Review & Submit',
]

export const CLAIM_STEPS = [
  'Claim Submitted',
  'Verification Questions',
  'Ownership Proof',
  'Admin Review',
  'Resolved',
]

export const TRUST_SCORE_COLORS = {
  high: 'text-green-400',    // 80–100
  medium: 'text-orange-400', // 50–79
  low: 'text-red-400',       // 0–49
}

export function getTrustScoreColor(score) {
  if (score >= 80) return TRUST_SCORE_COLORS.high
  if (score >= 50) return TRUST_SCORE_COLORS.medium
  return TRUST_SCORE_COLORS.low
}

export function getCategoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function getLocationLabel(value) {
  return CAMPUS_LOCATIONS.find((l) => l.value === value)?.label ?? value
}
