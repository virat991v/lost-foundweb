import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { adminService } from '../../services/admin/adminService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Pagination from '../../components/ui/Pagination'
import { format } from 'date-fns'

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'matched', label: 'Matched' },
  { value: 'verification', label: 'In Verification' },
  { value: 'returned', label: 'Returned' },
]

export default function AdminReportsDisputesPage() {
  const { profile } = useAuth()
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const totalPages = Math.ceil(count / 20)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getAllReports({ page: p, type, status, search })
    setItems(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 py-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white font-bold text-xl">Reports & Disputes Console</h1>
            <p className="text-gray-500 text-sm">{count} total reports</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load(1)}
                placeholder="Search reports..."
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors w-52"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-[#2a2a2a] mb-5">
          {['all', 'disputes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#D4F547] text-[#D4F547]'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab === 'all' ? `All Reports (${count})` : 'Active Disputes (0)'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="w-28">
            <Select options={TYPE_OPTIONS} value={type} onChange={(e) => { setType(e.target.value); load(1) }} />
          </div>
          <div className="w-40">
            <Select options={STATUS_OPTIONS} value={status} onChange={(e) => { setStatus(e.target.value); load(1) }} />
          </div>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">
          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-[10px] font-bold tracking-widest uppercase text-gray-500">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading…</td></tr>
                  ) : !items.length ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No reports found</td></tr>
                  ) : items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => { setSelected(item); setAdminNotes('') }}
                      className={`cursor-pointer hover:bg-[#1f1f1f] transition-colors ${
                        selected?.id === item.id ? 'bg-[#D4F547]/5 border-l-2 border-[#D4F547]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-[#D4F547] font-mono text-xs">
                          REP-{item.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium truncate max-w-[140px]">{item.title}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge status={item.report_type} label={item.report_type} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3"><Badge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); load(p) }} />
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 flex-shrink-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">
                  Case ID
                </p>
                <p className="text-[#D4F547] font-mono font-bold">REP-{selected.id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Item</p>
                <p className="text-white font-medium">{selected.title}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Description</p>
                <p className="text-gray-400 text-xs leading-relaxed">{selected.description}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Status</p>
                <Badge status={selected.status} />
              </div>
              <div>
                <Textarea
                  label="Admin Notes"
                  placeholder="Add admin notes..."
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="sm" className="w-full">Approve Match</Button>
                <Button variant="danger" size="sm" className="w-full">Reject Claim</Button>
                <Button variant="dark" size="sm" className="w-full">Escalate Case</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
