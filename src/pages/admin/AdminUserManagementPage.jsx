import { useState, useEffect } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { adminService } from '../../services/admin/adminService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import Select from '../../components/ui/Select'
import { getTrustScoreColor } from '../../utils/constants'

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'restricted', label: 'Restricted' },
]

export default function AdminUserManagementPage() {
  const { profile: adminProfile } = useAuth()
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState([])
  const [alert, setAlert] = useState(true)

  const totalPages = Math.ceil(count / 20)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getUsers({ page: p, role, status, search })
    setUsers(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  async function handleSuspend(userId) {
    await adminService.updateUserStatus(userId, 'suspended')
    await adminService.logActivity(adminProfile?.id, `Suspended user`, 'user', userId)
    load()
  }

  async function handleBulkSuspend() {
    await Promise.all(selected.map((id) => adminService.updateUserStatus(id, 'suspended')))
    setSelected([])
    load()
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-full px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-xl">User Management</h1>
            <p className="text-gray-500 text-sm">{count} users registered</p>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 font-semibold text-sm">Suspicious Claim Patterns Detected</p>
              <p className="text-red-400/80 text-xs mt-0.5">
                One or more users have submitted multiple claims with low match scores in the past 24 hours.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="danger" size="sm">Restrict Account</Button>
              <Button variant="ghost" size="sm" onClick={() => setAlert(false)}>Dismiss</Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(1)}
              placeholder="Search by name or email..."
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors"
            />
          </div>
          <div className="w-32">
            <Select options={ROLE_OPTIONS} value={role} onChange={(e) => { setRole(e.target.value); load(1) }} />
          </div>
          <div className="w-36">
            <Select options={STATUS_OPTIONS} value={status} onChange={(e) => { setStatus(e.target.value); load(1) }} />
          </div>
          {selected.length > 0 && (
            <>
              <span className="text-gray-400 text-sm">{selected.length} selected</span>
              <Button variant="danger" size="sm" onClick={handleBulkSuspend}>Bulk Suspend</Button>
            </>
          )}
          <Button variant="primary" size="sm">Export Data</Button>
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[10px] font-bold tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3 text-left w-8">
                  <input type="checkbox" className="accent-[#D4F547]" onChange={(e) => {
                    setSelected(e.target.checked ? users.map((u) => u.id) : [])
                  }} />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Trust Score</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Loading…</td></tr>
              ) : !users.length ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className={`hover:bg-[#1f1f1f] transition-colors ${selected.includes(u.id) ? 'bg-[#D4F547]/5' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="accent-[#D4F547]"
                      checked={selected.includes(u.id)}
                      onChange={(e) => setSelected((s) => e.target.checked ? [...s, u.id] : s.filter((id) => id !== u.id))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#D4F547] flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
                        {u.full_name?.[0] ?? 'U'}
                      </div>
                      <span className="text-white font-medium truncate max-w-[120px]">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell truncate max-w-[160px]">{u.email}</td>
                  <td className="px-4 py-3"><Badge status={u.role} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`font-semibold ${getTrustScoreColor(u.trust_score ?? 100)}`}>
                      {u.trust_score ?? 100}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={u.account_status === 'active' ? 'active' : 'suspended'} label={u.account_status} />
                  </td>
                  <td className="px-4 py-3">
                    {u.account_status === 'active' ? (
                      <Button variant="danger" size="sm" onClick={() => handleSuspend(u.id)}>Suspend</Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => adminService.updateUserStatus(u.id, 'active').then(load)}>
                        Restore
                      </Button>
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
