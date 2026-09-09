import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Calendar, ChevronRight, Share2, ShieldCheck, MessageSquare, CheckCircle, Package } from 'lucide-react'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import { claimsService } from '../../services/claims/claimsService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SimilarItems from '../../components/items/SimilarItems'
import { PageSpinner } from '../../components/ui/Spinner'
import { getCategoryLabel, getLocationLabel } from '../../utils/constants'
import { format } from 'date-fns'

export default function ItemDetailsPage() {
  const { type, id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState('')

  const service = type === 'found' ? foundItemsService : lostItemsService

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await service.getById(id)
        setItem(data)
        try {
          const sim = await service.getSimilar(data)
          setSimilar(sim)
        } catch {
          setSimilar([])
        }
      } catch (err) {
        console.error('ItemDetailsPage load error:', err)
        setItem(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, type])

  async function handleClaim() {
    if (!user) { navigate('/login'); return }
    setClaiming(true)
    setClaimError('')
    try {
      const claim = await claimsService.create({
        claimant_id: user.id,
        item_type: type,
        item_id: id,
      })
      navigate(`/claims/${claim.id}/verify`)
    } catch (err) {
      setClaimError(err.message ?? 'Failed to submit claim.')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!item) return <div className="p-8 text-center text-gray-500">Item not found.</div>

  const date = item.lost_date || item.found_date
  const isOwner = user?.id === item.user_id
  const isFound = type === 'found'

  // Label & messaging depends on item type
  const claimButtonLabel = isFound
    ? 'This is Mine — Claim It Back'
    : 'I Found This — I Have It'
  const claimButtonDesc = isFound
    ? 'If this is your lost item, submit a claim to prove ownership and get it back.'
    : 'If you found this item or know where it is, submit a claim to connect with the owner.'

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight size={14} />
          <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
          <ChevronRight size={14} />
          <span className="text-gray-300 truncate">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left — photo */}
          <div>
            <div className="aspect-square bg-[#111111] rounded-xl overflow-hidden border border-[#2a2a2a] flex items-center justify-center mb-3">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-700">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-sm">No photo provided</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Badge status={item.status} />
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isFound
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {isFound ? 'Found Item' : 'Lost Item'}
              </span>
              <span className="text-xs text-gray-500 bg-[#0a0a0a] border border-[#2a2a2a] px-2 py-0.5 rounded">
                {getCategoryLabel(item.category)}
              </span>
            </div>

            <h1 className="text-white font-bold text-2xl mb-3">{item.title}</h1>

            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-gray-600">Reported by</span>
                <span>{item.profiles?.full_name ? item.profiles.full_name.replace(/\s\S+$/, '') + ' ***' : 'Anonymous'}</span>
              </div>
              {date && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={14} className="text-gray-600" />
                  {format(new Date(date), 'MMMM d, yyyy')}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} className="text-gray-600" />
                {getLocationLabel(item.campus_location)}
                {item.specific_spot && ` — ${item.specific_spot}`}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
            </div>

            {item.identifying_details && (
              <div className="mb-5">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">
                  Distinguishing Features
                </h3>
                <ul className="space-y-1">
                  {item.identifying_details.split('\n').filter(Boolean).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4F547] mt-1.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Claim / Get Item Back section ── */}
            {!isOwner && item.status === 'active' && (
              <div className="mt-auto">
                <div className="bg-[#D4F547]/5 border border-[#D4F547]/20 rounded-xl p-4 mb-4">
                  <p className="text-[#D4F547] text-xs font-bold uppercase tracking-wider mb-1">
                    {isFound ? 'Is this your item?' : 'Do you have this item?'}
                  </p>
                  <p className="text-gray-400 text-sm">{claimButtonDesc}</p>
                </div>

                {claimError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-3">
                    <p className="text-red-400 text-sm">{claimError}</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full mb-3"
                  onClick={handleClaim}
                  loading={claiming}
                >
                  {claimButtonLabel}
                </Button>

                <p className="text-gray-600 text-xs text-center">
                  Your contact info stays private until admin verifies ownership
                </p>
              </div>
            )}

            {isOwner && (
              <div className="mt-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-gray-400 text-sm">This is your report.</p>
                <p className="text-gray-600 text-xs mt-1">
                  You'll be notified when someone submits a claim on this item.
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button
                className="flex items-center gap-1.5 text-gray-400 text-sm hover:text-white transition-colors"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                <Share2 size={14} />
                Share Link
              </button>
            </div>
          </div>
        </div>

        {/* ── How it works ── */}
        {!isOwner && item.status === 'active' && (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold text-sm mb-5">How to get your item back</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { icon: MessageSquare, step: '1', title: 'Submit a Claim', desc: 'Click the claim button above and answer a few verification questions.' },
                { icon: ShieldCheck,   step: '2', title: 'Admin Reviews',  desc: 'Campus admin verifies your answers against the private item details.' },
                { icon: CheckCircle,   step: '3', title: 'Get Approved',   desc: 'Once verified, your contact info is shared with the finder/reporter.' },
                { icon: Package,       step: '4', title: 'Collect Item',   desc: 'Meet at a campus safe zone and confirm the handoff in the app.' },
              ].map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#D4F547]/20 text-[#D4F547] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {step}
                    </span>
                    <Icon size={14} className="text-[#D4F547]" />
                  </div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <SimilarItems items={similar} type={type} />
        )}
      </div>
    </div>
  )
}
