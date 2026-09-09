import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin/adminService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import Select from '../../components/ui/Select'
import { format } from 'date-fns'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_verification', label: 'In Verification' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'needs_admin_review', label: 'Needs Review' },
]

export default function AdminOwnershipClaimsPage() {
  const { profile } = useAuth()
  const [claims, setClaims] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)

  const totalPages = Math.ceil(count / 20)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getAllClaims({ page: p, status })
    setClaims(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  async function handleApprove(claimId) {
    await adminService.approveClaim(claimId, profile?.id, '')
    await adminService.logActivity(profile?.id, 'Approved claim', 'claim', claimId)
    load()
    setSelected(null)
  }

  async function handleReject(claimId) {
    await adminService.rejectClaim(claimId, profile?.id, '')
    await adminService.logActivity(profile?.id, 'Rejected claim', 'claim', claimId)
    load()
    setSelected(null)
  }

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

        <div className="flex gap-5">
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
                      onClick={() => setSelected(claim)}
                      className={`cursor-pointer hover:bg-[#1f1f1f] transition-colors ${selected?.id === claim.id ? 'bg-[#D4F547]/5' : ''}`}
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
                            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(claim.id) }}>
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleReject(claim.id) }}>
                              Reject
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
            <div className="w-64 flex-shrink-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">Claim Details</p>
              <p className="text-[#D4F547] font-mono font-bold mb-3">
                CASE-{selected.id.slice(-6).toUpperCase()}
              </p>
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-gray-500 text-xs">Claimant</span>
                  <p className="text-white text-sm">{selected.profiles?.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Email</span>
                  <p className="text-white text-sm truncate">{selected.profiles?.email}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Status</span>
                  <div className="mt-1"><Badge status={selected.status} /></div>
                </div>
                {selected.admin_notes && (
                  <div>
                    <span className="text-gray-500 text-xs">Admin Notes</span>
                    <p className="text-gray-300 text-xs mt-1">{selected.admin_notes}</p>
                  </div>
                )}
              </div>
              {selected.status === 'under_verification' && (
                <div className="flex flex-col gap-2">
                  <Button variant="primary" size="sm" className="w-full" onClick={() => handleApprove(selected.id)}>
                    Approve Claim
                  </Button>
                  <Button variant="danger" size="sm" className="w-full" onClick={() => handleReject(selected.id)}>
                    Reject Claim
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
