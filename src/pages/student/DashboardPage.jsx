import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, CheckSquare, RotateCcw, Activity, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import { claimsService } from '../../services/claims/claimsService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { formatDistanceToNow } from 'date-fns'

function StatsCard({ label, value, icon: Icon, desc }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-[#D4F547]/10 flex items-center justify-center">
          <Icon size={15} className="text-[#D4F547]" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {desc && <p className="text-gray-600 text-xs">{desc}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [lostItems, setLostItems] = useState([])
  const [foundItems, setFoundItems] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const [lost, found, c] = await Promise.all([
        lostItemsService.getByUser(user.id),
        foundItemsService.getByUser(user.id),
        claimsService.getByUser(user.id),
      ])
      setLostItems(lost ?? [])
      setFoundItems(found ?? [])
      setClaims(c ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  const returned = claims.filter((c) => c.status === 'approved').length
  const activeClaims = claims.filter((c) => ['pending', 'under_verification'].includes(c.status))

  const recentActivity = [
    ...lostItems.slice(0, 2).map((i) => ({ type: 'lost', item: i })),
    ...foundItems.slice(0, 1).map((i) => ({ type: 'found', item: i })),
    ...claims.slice(0, 2).map((c) => ({ type: 'claim', item: c })),
  ].sort((a, b) => new Date(b.item.created_at) - new Date(a.item.created_at)).slice(0, 5)

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white font-bold text-2xl">Dashboard Hub</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Monitor reported items and verified claims
              {profile?.full_name && `, ${profile.full_name}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/report-found">
              <Button variant="outlineLime" size="sm">Report Found Item</Button>
            </Link>
            <Link to="/report-lost">
              <Button variant="primary" size="sm">Report Lost Item</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="My Lost Reports" value={lostItems.length} icon={FileText} desc="Total reports filed" />
          <StatsCard label="My Found Submissions" value={foundItems.length} icon={Search} desc="Items reported found" />
          <StatsCard label="Active Claims" value={activeClaims.length} icon={CheckSquare} desc="Claims in progress" />
          <StatsCard label="Items Returned" value={returned} icon={RotateCcw} desc="Successfully reunited" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center gap-2">
              <Activity size={16} className="text-[#D4F547]" />
              <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center text-gray-500 text-sm">Loading…</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No activity yet</p>
                <Link to="/report-lost">
                  <Button variant="outlineLime" size="sm">Report your first item</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1f1f1f]">
                {recentActivity.map(({ type, item }) => (
                  <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      type === 'lost' ? 'bg-orange-400' : type === 'found' ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <div>
                      <p className="text-white text-sm">
                        {type === 'lost' ? 'Lost report posted' : type === 'found' ? 'Found item submitted' : 'Claim filed'}:{' '}
                        <span className="text-gray-300">{item.title || 'Claim'}</span>
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Claims */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-[#D4F547]" />
                <h2 className="text-white font-semibold text-sm">Active Claims</h2>
              </div>
              <Link to="/my-claims" className="text-[#D4F547] text-xs hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <div className="p-6 text-center text-gray-500 text-sm">Loading…</div>
            ) : activeClaims.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No active claims</p>
                <Link to="/browse">
                  <Button variant="outline" size="sm">Browse items to claim</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1f1f1f]">
                {activeClaims.map((claim) => (
                  <div key={claim.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[#D4F547] text-xs font-mono font-medium">
                        CASE-{claim.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs capitalize mt-0.5">{claim.item_type} item</p>
                    </div>
                    <Badge status={claim.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
