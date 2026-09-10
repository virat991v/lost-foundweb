import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, MessageSquare, MapPin, AlertTriangle, Mail, Copy } from 'lucide-react'
import { claimsService } from '../../services/claims/claimsService'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/Spinner'

const meetingSpots = [
  { name: 'Library Lobby', desc: 'Main entrance, staffed during all open hours', icon: '📚' },
  { name: 'Student Center Info Desk', desc: 'Central campus hub with security cameras', icon: '🏛️' },
  { name: 'Campus Security Office', desc: 'Most secure option — officer present', icon: '🔒' },
]

function ContactCard({ label, name, email, phone, isYou = false }) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  function copyEmail() {
    navigator.clipboard?.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  function copyPhone() {
    navigator.clipboard?.writeText(phone)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  return (
    <div className={`bg-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 ${
      isYou ? 'border border-[#D4F547]/30' : 'border border-[#2a2a2a]'
    }`}>
      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
        {label}
      </p>

      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          isYou ? 'bg-[#D4F547] text-black' : 'bg-[#2a2a2a] text-white'
        }`}>
          {name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">{name ?? 'Unknown'}</p>
          {isYou && <p className="text-gray-500 text-xs">That's you</p>}
        </div>
      </div>

      {/* Email row */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 flex items-center gap-2">
        <Mail size={13} className="text-gray-500 flex-shrink-0" />
        <span className="text-white text-sm flex-1 truncate">{email ?? '—'}</span>
        {email && (
          <button onClick={copyEmail} className="text-gray-500 hover:text-[#D4F547] transition-colors flex-shrink-0" title="Copy email">
            {copiedEmail ? <CheckCircle size={13} className="text-[#D4F547]" /> : <Copy size={13} />}
          </button>
        )}
      </div>

      {/* Phone row */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 flex items-center gap-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 flex-shrink-0">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
        </svg>
        <span className={`text-sm flex-1 truncate ${phone ? 'text-white' : 'text-gray-600 italic'}`}>
          {phone || 'Not provided'}
        </span>
        {phone && (
          <button onClick={copyPhone} className="text-gray-500 hover:text-[#D4F547] transition-colors flex-shrink-0" title="Copy phone">
            {copiedPhone ? <CheckCircle size={13} className="text-[#D4F547]" /> : <Copy size={13} />}
          </button>
        )}
      </div>

      {/* Action buttons */}
      {!isYou && (
        <div className="flex gap-2 mt-1">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#D4F547] hover:bg-[#c2e040] text-black font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
              <MessageSquare size={13} />
              Email
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[#D4F547] text-[#D4F547] hover:bg-[#D4F547]/10 font-semibold text-xs py-2.5 rounded-lg transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
              Call
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function ContactRevealPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [claim, setClaim] = useState(null)
  const [reporter, setReporter] = useState(null)   // person who posted the item
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const claimData = await claimsService.getById(id)
        setClaim(claimData)

        // Fetch the item to get the reporter's profile
        const itemService = claimData.item_type === 'lost' ? lostItemsService : foundItemsService
        const itemData = await itemService.getById(claimData.item_id)
        setReporter(itemData?.profiles ?? null)
      } catch (err) {
        console.error('ContactRevealPage load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <PageSpinner />
  if (!claim) return <div className="p-8 text-center text-gray-500">Claim not found.</div>

  // The person viewing this page is the claimant (owner proving it's theirs)
  // The reporter is whoever posted the found/lost item
  const isClaimant = user?.id === claim.claimant_id
  const reporterProfile = reporter
  const claimantProfile = profile  // current user

  // Determine card labels based on item type
  const myLabel    = claim.item_type === 'found' ? 'Owner (You)'   : 'You'
  const otherLabel = claim.item_type === 'found' ? 'Item Reporter / Finder' : 'Item Reporter'

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Approval banner */}
        <div className="bg-[#D4F547]/10 border border-[#D4F547]/20 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
          <CheckCircle size={20} className="text-[#D4F547] flex-shrink-0" />
          <div>
            <p className="text-[#D4F547] font-semibold text-sm">Verification Approved ✓</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Your ownership has been verified. Use the email below to contact the reporter and arrange collection.
            </p>
          </div>
        </div>

        <h1 className="text-[#D4F547] font-bold text-2xl mb-2">Arrange Return Handoff</h1>
        <p className="text-gray-500 text-sm mb-6">
          Contact the {claim.item_type === 'found' ? 'finder' : 'reporter'} directly via email to arrange a meeting.
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <ContactCard
            label={myLabel}
            name={claimantProfile?.full_name}
            email={claimantProfile?.email}
            phone={claimantProfile?.phone}
            isYou={true}
          />
          <ContactCard
            label={otherLabel}
            name={reporterProfile?.full_name ?? 'Campus User'}
            email={reporterProfile?.email ?? 'Contact via admin'}
            phone={reporterProfile?.phone}
          />
        </div>

        {/* How to contact tip */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <Mail size={16} className="text-[#D4F547] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium mb-1">How to get your item back</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Click <strong className="text-white">Send Email</strong> to open your email app with their address pre-filled.
              Introduce yourself, mention the case ID <span className="font-mono text-[#D4F547]">CASE-{claim.id.slice(-6).toUpperCase()}</span>, and agree on a time and meeting spot below.
            </p>
          </div>
        </div>

        {/* Meeting spots */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#D4F547]" />
            <h2 className="text-white font-semibold">Recommended Safe Campus Meeting Spots</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {meetingSpots.map((spot) => (
              <div key={spot.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <span className="text-2xl block mb-2">{spot.icon}</span>
                <p className="text-white font-medium text-sm mb-1">{spot.name}</p>
                <p className="text-gray-500 text-xs">{spot.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety advice */}
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4">
          <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-semibold text-sm mb-1">Safety Advice</p>
            <p className="text-amber-300/80 text-xs leading-relaxed">
              Meet in public campus locations only. Coordinate during daylight hours.
              Bring your student ID. If uncomfortable, contact Campus Security at ext. 911.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
