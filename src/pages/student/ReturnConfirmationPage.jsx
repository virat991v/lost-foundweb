import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Star } from 'lucide-react'
import { claimsService } from '../../services/claims/claimsService'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import { PageSpinner } from '../../components/ui/Spinner'
import { format, differenceInDays } from 'date-fns'

export default function ReturnConfirmationPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [claim, setClaim] = useState(null)
  const [returnRecord, setReturnRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const c = await claimsService.getById(id)
      setClaim(c)
      const r = await claimsService.getReturn(id)
      setReturnRecord(r)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleConfirmAndRate() {
    setSubmitting(true)
    try {
      let ret = returnRecord
      if (!ret) {
        ret = await claimsService.createReturn(id)
      }
      if (rating && ret?.id) {
        await claimsService.submitRating(ret.id, rating, feedback)
      }
      // Mark the item as returned
      if (claim?.item_id && claim?.item_type) {
        const itemService = claim.item_type === 'lost' ? lostItemsService : foundItemsService
        await itemService.updateStatus(claim.item_id, 'returned')
      }
      setDone(true)
    } catch (err) {
      console.error('Return confirmation error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />

  const caseId = `CASE-${id?.slice(-6).toUpperCase()}`
  const reportedAt = claim?.created_at ? format(new Date(claim.created_at), 'MMM d, yyyy') : '—'
  const returnedAt = format(new Date(), 'MMM d, yyyy')
  const daysToResolve = claim?.created_at
    ? differenceInDays(new Date(), new Date(claim.created_at))
    : 0

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-12">
        {/* Success icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#D4F547]/20 border-2 border-[#D4F547] flex items-center justify-center mb-5">
            <CheckCircle size={40} className="text-[#D4F547]" />
          </div>
          <h1 className="text-white font-bold text-2xl text-center">Item Successfully Returned!</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            This case has been resolved. Both parties have confirmed the handoff.
          </p>
        </div>

        {/* Case summary */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-4">
            Case Summary: {caseId}
          </h3>
          <div className="space-y-3">
            {[
              ['Item Name', claim?.item_type ? `${claim.item_type} item` : '—'],
              ['Date Reported', reportedAt],
              ['Date Returned', returnedAt],
              ['Time to Resolution', `${daysToResolve} day${daysToResolve !== 1 ? 's' : ''}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className={`text-sm font-medium ${label === 'Time to Resolution' ? 'text-[#D4F547]' : 'text-white'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmations */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Owner Confirmed</span>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Finder Confirmed</span>
          </div>
        </div>

        {/* Rating */}
        {!done ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
            <h3 className="text-white font-semibold text-sm mb-4">Rate Your Experience</h3>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-[#D4F547] fill-[#D4F547]'
                        : 'text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              label="Optional Feedback"
              placeholder="Share your experience to help improve the platform..."
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 mb-5 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-400" />
            <p className="text-green-300 text-sm">Thank you for your feedback!</p>
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mb-3"
          onClick={done ? () => navigate('/dashboard') : handleConfirmAndRate}
          loading={submitting}
        >
          {done ? 'Back to Dashboard' : 'Confirm & Submit Feedback'}
        </Button>

        <p className="text-center text-gray-600 text-xs">
          This case will be archived for campus records.
        </p>
      </div>
    </div>
  )
}
