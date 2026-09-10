import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Clock, ShieldCheck, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { claimsService } from '../../services/claims/claimsService'
import { PageSpinner } from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import { formatDistanceToNow } from 'date-fns'

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Claim Submitted',
    message: 'Your claim is waiting for you to complete the verification questions.',
    action: 'verify',
    actionLabel: 'Complete Verification →',
  },
  under_verification: {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Under Review',
    message: 'A campus admin is reviewing your answers and verifying your ownership details. This usually takes a few hours.',
    action: null,
  },
  approved: {
    icon: CheckCircle,
    color: 'text-[#D4F547]',
    bg: 'bg-[#D4F547]/10 border-[#D4F547]/20',
    title: 'Claim Approved! 🎉',
    message: 'Your ownership has been verified. You can now see the finder\'s contact details and arrange to collect your item.',
    action: 'contact',
    actionLabel: 'Arrange Return →',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    title: 'Claim Rejected',
    message: 'Your claim could not be verified. This may be because the answers did not match the item\'s private details.',
    action: null,
  },
  needs_admin_review: {
    icon: ShieldCheck,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Escalated for Review',
    message: 'Your claim has been escalated to a senior admin for further review.',
    action: null,
  },
  cancelled: {
    icon: XCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10 border-gray-500/20',
    title: 'Claim Cancelled',
    message: 'This claim has been cancelled.',
    action: null,
  },
}

const TIMELINE_STEPS = [
  { key: 'pending',            label: 'Claim Created',     desc: 'You submitted the claim' },
  { key: 'under_verification', label: 'Admin Reviewing',   desc: 'Campus admin checks your answers' },
  { key: 'approved',           label: 'Verified',          desc: 'Ownership confirmed' },
  { key: 'contact',            label: 'Arrange Return',    desc: 'Contact revealed, meet to collect' },
]

const STATUS_ORDER = ['pending', 'under_verification', 'approved', 'contact']

export default function ClaimStatusPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const data = await claimsService.getById(id)
      setClaim(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [id]) // eslint-disable-line

  function handleRefresh() {
    setRefreshing(true)
    load()
  }

  if (loading) return <PageSpinner />
  if (!claim) return <div className="p-8 text-center text-gray-500">Claim not found.</div>

  const config = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.pending
  const Icon = config.icon
  const currentStepIndex = STATUS_ORDER.indexOf(
    claim.status === 'approved' ? 'approved' : claim.status
  )

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#D4F547] font-mono text-sm font-bold">
              CASE-{claim.id.slice(-6).toUpperCase()}
            </p>
            <h1 className="text-white font-bold text-xl mt-0.5">Claim Status</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-gray-400 text-sm hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Status banner */}
        <div className={`border rounded-xl px-5 py-4 mb-8 flex items-start gap-4 ${config.bg}`}>
          <Icon size={24} className={`${config.color} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`font-bold text-base ${config.color}`}>{config.title}</p>
            <p className="text-gray-300 text-sm mt-1 leading-relaxed">{config.message}</p>
            {claim.admin_notes && (
              <div className="mt-3 bg-black/20 rounded-lg px-3 py-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Admin Note</p>
                <p className="text-gray-300 text-sm">{claim.admin_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold text-sm mb-5">Review Process</h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-3 top-3 bottom-3 w-px bg-[#2a2a2a]" />
            <div className="space-y-6">
              {TIMELINE_STEPS.map((step, i) => {
                const done = i <= currentStepIndex
                const active = i === currentStepIndex
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                      done
                        ? 'bg-[#D4F547] border-[#D4F547]'
                        : 'bg-[#0a0a0a] border-[#2a2a2a]'
                    }`}>
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-medium ${done ? 'text-white' : 'text-gray-600'} ${active ? 'text-[#D4F547]' : ''}`}>
                        {step.label}
                        {active && <span className="ml-2 text-xs font-normal text-gray-400">← you are here</span>}
                      </p>
                      <p className={`text-xs mt-0.5 ${done ? 'text-gray-400' : 'text-gray-700'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Who reviews it */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-3">Who reviews your claim?</h3>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4F547]/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} className="text-[#D4F547]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Campus Admin</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                A verified campus administrator reviews your verification answers and
                compares them against the private item details that only the true owner
                would know. They approve or reject based on accuracy.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[#1a1a1a] rounded-lg px-3 py-2.5 border border-[#2a2a2a]">
            <p className="text-gray-500 text-xs">
              ⏱ Average review time: <span className="text-white">a few hours</span> during campus hours
            </p>
          </div>
        </div>

        {/* Submitted at */}
        <p className="text-gray-600 text-xs text-center mb-6">
          Claim submitted {formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}
        </p>

        {/* Action button */}
        <div className="flex flex-col gap-3">
          {config.action === 'verify' && (
            <Button variant="primary" className="w-full" onClick={() => navigate(`/claims/${id}/verify`)}>
              Complete Verification <ArrowRight size={16} />
            </Button>
          )}
          {config.action === 'contact' && (
            <Button variant="primary" className="w-full" onClick={() => navigate(`/claims/${id}/contact`)}>
              Arrange Return — View Contact Info <ArrowRight size={16} />
            </Button>
          )}
          <Link to="/my-claims">
            <button className="w-full text-gray-400 text-sm hover:text-white transition-colors py-2">
              View all my claims
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}
