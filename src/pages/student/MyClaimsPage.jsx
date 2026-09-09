import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { claimsService } from '../../services/claims/claimsService'
import Badge from '../../components/ui/Badge'
import { PageSpinner } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatDistanceToNow } from 'date-fns'

export default function MyClaimsPage() {
  const { user } = useAuth()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    claimsService.getByUser(user.id).then((data) => {
      setClaims(data ?? [])
      setLoading(false)
    })
  }, [user])

  if (loading) return <PageSpinner />

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-white font-bold text-2xl">My Claims</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track all your ownership claim submissions</p>
        </div>

        {!claims.length ? (
          <EmptyState
            icon={<ClipboardList size={40} />}
            title="No claims yet"
            description="Browse items and submit a claim when you find something that belongs to you."
            action={<Link to="/browse"><button className="bg-[#D4F547] text-black font-semibold px-5 py-2 rounded-lg text-sm hover:bg-[#c2e040] transition-colors">Browse Items</button></Link>}
          />
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl divide-y divide-[#1f1f1f]">
            {claims.map((claim) => (
              <div key={claim.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#D4F547] text-xs font-mono font-medium">
                    CASE-{claim.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-white text-sm font-medium mt-0.5 capitalize">
                    {claim.item_type} item claim
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={claim.status} />
                  {claim.status === 'pending' && (
                    <Link to={`/claims/${claim.id}/verify`}>
                      <button className="flex items-center gap-1 text-[#D4F547] text-xs hover:underline">
                        Continue <ArrowRight size={12} />
                      </button>
                    </Link>
                  )}
                  {claim.status === 'approved' && (
                    <Link to={`/claims/${claim.id}/contact`}>
                      <button className="flex items-center gap-1 text-[#D4F547] text-xs hover:underline">
                        Arrange Return <ArrowRight size={12} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
