import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin/adminService'
import Pagination from '../../components/ui/Pagination'
import { format } from 'date-fns'

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const totalPages = Math.ceil(count / 30)

  async function load(p = page) {
    setLoading(true)
    const res = await adminService.getActivityLogs({ page: p })
    setLogs(res.data ?? [])
    setCount(res.count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 py-6">
        <div className="mb-5">
          <h1 className="text-white font-bold text-xl">Activity Log</h1>
          <p className="text-gray-500 text-sm">{count} events recorded</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[10px] font-bold tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3 text-left">Timestamp</th>
                <th className="px-4 py-3 text-left">Actor</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading…</td></tr>
              ) : !logs.length ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No activity recorded yet</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {format(new Date(log.created_at), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {log.profiles?.full_name ?? 'System'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.action}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs capitalize hidden md:table-cell">
                    {log.target_type ? `${log.target_type.replace(/_/g, ' ')}` : '—'}
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
