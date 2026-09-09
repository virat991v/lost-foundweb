import { useState, useEffect } from 'react'
import { Search, Bell, FileText, Users, CheckSquare, Percent, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/admin/adminService'
import StatsCard from '../../components/admin/StatsCard'
import RecentActivity from '../../components/admin/RecentActivity'
import NeedsAttention from '../../components/admin/NeedsAttention'
import Button from '../../components/ui/Button'

export default function AdminDashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, logsRes, flagsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getActivityLogs({ limit: 8 }),
        adminService.getFlags({ status: 'open', limit: 3 }),
      ])
      setStats(s)
      setLogs(logsRes.data ?? [])
      setFlags(flagsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleResolveFlag(flagId) {
    await adminService.resolveFlag(flagId, profile?.id)
    setFlags((prev) => prev.filter((f) => f.id !== flagId))
  }

  function exportCSV(data, filename) {
    if (!data?.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(','), ...data.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  }

  async function handleExportClaims() {
    const data = await adminService.exportClaimsCSV()
    exportCSV(data, 'claims-export.csv')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-full px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-white font-bold text-xl">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-0.5">Stanford University (Admin)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input placeholder="Search reports..." className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors w-56" />
            </div>
            <button className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white">
              <Bell size={16} />
            </button>
            <Button variant="dark" size="sm">Campus Admin</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard label="Total Reports This Month" value={loading ? '—' : stats?.totalReports ?? 0} trend={12} icon={FileText} />
          <StatsCard label="Active Cases" value={loading ? '—' : stats?.activeCases ?? 0} trend={-4} icon={CheckSquare} />
          <StatsCard label="Resolution Rate" value={loading ? '—' : `${stats?.resolutionRate ?? 0}%`} trend={3} icon={Percent} />
          <StatsCard label="Pending Verifications" value={loading ? '—' : stats?.pendingVerifications ?? 0} trend={-5} icon={Clock} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <RecentActivity logs={logs} />
          </div>
          <div className="flex flex-col gap-5">
            <NeedsAttention flags={flags} onResolve={handleResolveFlag} />

            {/* Quick Operations */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Quick Operations</h3>
              <div className="flex flex-col gap-2">
                <Button variant="dark" size="sm" className="w-full justify-start">
                  Generate Campus PDF Audit
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleExportClaims}>
                  Export CSV Claims Data
                </Button>
                <Button variant="danger" size="sm" className="w-full justify-start">
                  Broadcast Campus Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
