import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, MessageSquare, MapPin, AlertTriangle } from 'lucide-react'
import { claimsService } from '../../services/claims/claimsService'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/Spinner'

const meetingSpots = [
  { name: 'Library Lobby', desc: 'Main entrance, staffed during all open hours', icon: '📚' },
  { name: 'Student Center Info Desk', desc: 'Central campus hub with security cameras', icon: '🏛️' },
  { name: 'Campus Security Office', desc: 'Most secure option — officer present', icon: '🔒' },
]

export default function ContactRevealPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [disclosed, setDisclosed] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await claimsService.getById(id)
      setClaim(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleReveal() {
    await claimsService.revealContact(id, user.id)
    setDisclosed(true)
  }

  if (loading) return <PageSpinner />
  if (!claim) return <div className="p-8 text-center text-gray-500">Claim not found.</div>

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Approval banner */}
        <div className="bg-[#D4F547]/10 border border-[#D4F547]/20 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
          <CheckCircle size={20} className="text-[#D4F547] flex-shrink-0" />
          <div>
            <p className="text-[#D4F547] font-semibold text-sm">Verification Approved ✓</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Your ownership claim has been verified. Contact details are now available for arranging the return.
            </p>
          </div>
        </div>

        <h1 className="text-[#D4F547] font-bold text-2xl mb-6">Arrange Return Handoff</h1>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Reporter (you) */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-4">
              Item Reporter (You)
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4F547] flex items-center justify-center text-black font-bold text-sm">
                {profile?.full_name?.[0] ?? 'U'}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{profile?.full_name ?? 'You'}</p>
                <p className="text-gray-500 text-xs">{profile?.email}</p>
              </div>
            </div>
            <Button variant="primary" size="sm" className="w-full" icon={<MessageSquare size={14} />}>
              Send Message
            </Button>
          </div>

          {/* Finder */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-4">
              Item Finder
            </p>
            {disclosed || claim.status === 'approved' ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                    {claim.profiles?.full_name?.[0] ?? '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {claim.profiles?.full_name ?? 'Verified User'}
                    </p>
                    <p className="text-gray-500 text-xs">{claim.profiles?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" icon={<MessageSquare size={14} />}>
                  Send Message
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">Contact details are hidden</p>
                <Button variant="outlineLime" size="sm" onClick={handleReveal}>
                  Reveal Contact
                </Button>
              </div>
            )}
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
