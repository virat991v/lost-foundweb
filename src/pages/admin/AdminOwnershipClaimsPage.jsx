import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin/adminService'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import Select from '../../components/ui/Select'
import { ShieldCheck, ShieldX, User, FileText, Lock, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_verification', label: 'In Verification' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'needs_admin_review', label: 'Needs Review' },
]

function Section({ label, children }) {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4">
      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">{label}</p>
      {children}
    </div>
  )
}

function AnswerRow({ question, answer }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-gray-500 text-xs mb-1">{question}</p>
      <p className="text-white text-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 leading-relaxed">
        {answer || <span className="text-gray-600 italic">No answer provided</span>}
      </p>
    </div>
  )
}

export default function AdminOwnershipClaimsPage() {
  const { profile } = useAuth()
  const [claims, setClaims] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [itemDetail, setItemDetail] = useState(null)  // the reported item with private_verification
  const [loadingItem, setLoadingItem] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  const totalPages = Math.ceil(count / 20)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getAllClaims({ page: p, status })
    setClaims(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  async function handleSelect(claim) {
    setSelected(claim)
    setAdminNotes(claim.admin_notes ?? '')
    setItemDetail(null)
    setLoadingItem(true)
    try {
      const svc = claim.item_type === 'lost' ? lostItemsService : foundItemsService
      const item = await svc.getById(claim.item_id)
      setItemDetail(item)
    } catch (err) {
      console.error('Failed to load item for claim:', err)
    } finally {
      setLoadingItem(false)
    }
  }

  async function handleApprove(claimId) {
    await adminService.approveClaim(claimId, profile?.id, adminNotes)
    await adminService.logActivity(profile?.id, 'Approved claim', 'claim', claimId)
    load()
    setSelected(null)
    setItemDetail(null)
  }

  async function handleReject(claimId) {
    await adminService.rejectClaim(claimId, profile?.id, adminNotes)
    await adminService.logActivity(profile?.id, 'Rejected claim', 'claim', claimId)
    load()
    setSelected(null)
    setItemDetail(null)
  }

  const verif = selected?.verification_response ?? {}

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white font-bold text-xl">Ownership Claims</h1>
            <p className="text-gray-500 text-sm">{count} total claims</p>
          </div>
          <div className="w-44">
            <Select options={STATUS_OPTIONS} value={status} onChange={(e) => { setStatus(e.target.value); load(1) }} />
          </div>
        </div>

        <div className="flex gap-5 items-start">
          {/* Claims table */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-[10px] font-bold tracking-widest uppercase text-gray-500">
                    <th className="px-4 py-3 text-left">Case ID</th>
                    <th className="px-4 py-3 text-left">Claimant</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Filed</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading…</td></tr>
                  ) : !claims.length ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No claims found</td></tr>
                  ) : claims.map((claim) => (
                    <tr
                      key={claim.id}
                      onClick={() => handleSelect(claim)}
                      className={`cursor-pointer hover:bg-[#1f1f1f] transition-colors ${selected?.id === claim.id ? 'bg-[#D4F547]/5 border-l-2 border-l-[#D4F547]' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-[#D4F547] font-mono text-xs">
                          CASE-{claim.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">
                        {claim.profiles?.full_name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge status={claim.item_type} label={claim.item_type} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {format(new Date(claim.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3"><Badge status={claim.status} /></td>
                      <td className="px-4 py-3">
                        {claim.status === 'under_verification' && (
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleSelect(claim); }}>
                              Review
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); load(p) }} />
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-[420px] flex-shrink-0 flex flex-col gap-4">

              {/* Header */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#D4F547] font-mono font-bold text-sm">
                    CASE-{selected.id.slice(-6).toUpperCase()}
                  </p>
                  <Badge status={selected.status} />
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <User size={12} />
                  <span>{selected.profiles?.full_name} — {selected.profiles?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                  <FileText size={12} />
                  <span className="capitalize">{selected.item_type} item claim · {format(new Date(selected.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Item info + private verification (what reporter wrote) */}
              <Section label="🔒 Reporter's Private Verification (Secret)">
                {loadingItem ? (
                  <p className="text-gray-500 text-sm">Loading item details…</p>
                ) : itemDetail ? (
                  <>
                    <div className="mb-3">
                      <p className="text-gray-500 text-xs mb-1">Item Title</p>
                      <p className="text-white text-sm font-semibold">{itemDetail.title}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-gray-500 text-xs mb-1">Item Description</p>
                      <p className="text-gray-300 text-sm">{itemDetail.description}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lock size={11} className="text-yellow-400" />
                        <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Private Verification Detail</p>
                      </div>
                      <p className="text-yellow-200 text-sm leading-relaxed">
                        {itemDetail.private_verification || <span className="text-gray-500 italic">Not provided</span>}
                      </p>
                    </div>
                    {itemDetail.identifying_details && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-xs mb-1">Distinguishing Features</p>
                        <p className="text-gray-300 text-sm">{itemDetail.identifying_details}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic">Could not load item details</p>
                )}
              </Section>

              {/* Claimant's verification answers */}
              <Section label="📝 Claimant's Verification Answers">
                {selected.verification_response ? (
                  <>
                    <AnswerRow
                      question="Q1: Describe the item in detail"
                      answer={verif.q1}
                    />
                    <AnswerRow
                      question="Q2: Distinguishing marks or unique features"
                      answer={verif.q2}
                    />
                    <AnswerRow
                      question="Q3: When and where did you lose it?"
                      answer={verif.q3}
                    />
                    {selected.proof_url && (
                      <a
                        href={selected.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 mt-3 text-[#D4F547] text-sm hover:underline"
                      >
                        <ExternalLink size={13} />
                        View Proof Document
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Claimant has not submitted verification answers yet.
                  </p>
                )}
              </Section>

              {/* Admin notes */}
              <Section label="Admin Notes">
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this decision (visible to claimant)..."
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors resize-none"
                />
              </Section>

              {/* Actions */}
              {selected.status === 'under_verification' && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#D4F547] hover:bg-[#c2e040] text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    <ShieldCheck size={16} />
                    Approve — Answers Match
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-400 hover:bg-red-500/10 font-bold py-3 rounded-xl transition-colors"
                  >
                    <ShieldX size={16} />
                    Reject — Answers Don't Match
                  </button>
                </div>
              )}

              {(selected.status === 'approved' || selected.status === 'rejected') && (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  selected.status === 'approved'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  This claim has been {selected.status}.
                  {selected.admin_notes && <p className="text-xs mt-1 opacity-80">{selected.admin_notes}</p>}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
