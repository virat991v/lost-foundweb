import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'
import { claimsService } from '../../services/claims/claimsService'
import { useAuth } from '../../context/AuthContext'
import ClaimStepIndicator from '../../components/claims/ClaimStepIndicator'
import VerificationForm from '../../components/claims/VerificationForm'
import { PageSpinner } from '../../components/ui/Spinner'
import { CLAIM_STEPS } from '../../utils/constants'

export default function ClaimVerificationPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const data = await claimsService.getById(id)
      setClaim(data)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit({ answers, proofFile }) {
    setSubmitting(true)
    setError('')
    try {
      await claimsService.submitVerification(id, answers, proofFile, user.id)
      navigate(`/claims/${id}/status`)
    } catch (err) {
      setError(err.message ?? 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[#D4F547] font-bold text-2xl mb-1">Claim Verification</h1>
          <p className="text-gray-400 text-sm">
            Complete ownership verification questions to proceed with your claim.
          </p>
        </div>

        <div className="mb-8">
          <ClaimStepIndicator steps={CLAIM_STEPS} currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-white font-semibold mb-5">Answer Verification Questions</h2>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <VerificationForm onSubmit={handleSubmit} loading={submitting} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-[#D4F547]" />
                <h3 className="text-white font-semibold text-sm">Privacy & Security</h3>
              </div>
              <ul className="space-y-3 text-gray-400 text-xs leading-relaxed">
                <li className="flex gap-2">
                  <Lock size={12} className="text-[#D4F547] flex-shrink-0 mt-0.5" />
                  All answers are encrypted and only accessible to campus admins during review.
                </li>
                <li className="flex gap-2">
                  <Lock size={12} className="text-[#D4F547] flex-shrink-0 mt-0.5" />
                  Your contact details remain hidden until ownership is verified.
                </li>
                <li className="flex gap-2">
                  <Lock size={12} className="text-[#D4F547] flex-shrink-0 mt-0.5" />
                  False claims result in trust score reduction and potential account suspension.
                </li>
              </ul>
            </div>

            {claim && (
              <div className="mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Case ID</p>
                <p className="text-[#D4F547] font-mono font-bold">
                  CASE-{claim.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-gray-500 text-xs mt-1 capitalize">
                  {claim.item_type} item claim
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
