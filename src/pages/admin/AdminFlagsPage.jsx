import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin/adminService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Pagination from '../../components/ui/Pagination'
import { format } from 'date-fns'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
]

export default function AdminFlagsPage() {
  const { profile } = useAuth()
  const [flags, setFlags] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('open')

  const totalPages = Math.ceil(count / 20)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getFlags({ page: p, status })
    setFlags(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  async function handleResolve(flagId, flagStatus = 'resolved') {
    await adminService.resolveFlag(flagId, profile?.id, flagStatus)
    load()
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white font-bold text-xl">Flags & Disputes</h1>
            <p className="text-gray-500 text-sm">{count} items flagged</p>
          </div>
          <div className="w-44">
            <Select options={STATUS_OPTIONS} value={status} onChange={(e) => { setStatus(e.target.value); load(1) }} />
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[10px] font-bold tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3 text-left">Flag ID</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Reporter</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Target</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Filed</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Loading…</td></tr>
              ) : !flags.length ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No flags found</td></tr>
              ) : flags.map((flag) => (
                <tr key={flag.id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[#D4F547] font-mono text-xs">
                      FLAG-{flag.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white capitalize">
                    {flag.reason?.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {flag.profiles?.full_name ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-gray-400 text-xs capitalize">{flag.target_type?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {format(new Date(flag.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3"><Badge status={flag.status} /></td>
                  <td className="px-4 py-3">
                    {flag.status === 'open' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={() => handleResolve(flag.id, 'resolved')}>
                          Resolve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleResolve(flag.id, 'dismissed')}>
                          Dismiss
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
    </div>
  )
}
