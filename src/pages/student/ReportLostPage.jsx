import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Upload, Lightbulb, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { lostItemsService } from '../../services/items/lostItemsService'
import ClaimStepIndicator from '../../components/claims/ClaimStepIndicator'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { CATEGORIES, CAMPUS_LOCATIONS, REPORT_LOST_STEPS } from '../../utils/constants'

const initialForm = {
  title: '', category: '', brand_model: '', color: '', description: '',
  campus_location: '', specific_spot: '', lost_date: '', lost_time: '',
  private_verification: '', identifying_details: '',
}

export default function ReportLostPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function validateStep1() {
    const e = {}
    if (!form.title.trim()) e.title = 'Item name is required'
    if (!form.category) e.category = 'Please select a category'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  function validateStep2() {
    const e = {}
    if (!form.campus_location) e.campus_location = 'Please select a location'
    if (!form.lost_date) e.lost_date = 'Date is required'
    if (!form.private_verification.trim()) e.private_verification = 'Verification detail is required'
    return e
  }

  function nextStep() {
    const e = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {}
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  async function handleSubmit() {
    setSubmitError('')
    setSubmitting(true)
    try {
      await lostItemsService.create({ ...form, user_id: user.id }, photoFile)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('rls') || msg.toLowerCase().includes('violates')) {
        setSubmitError('Permission denied. Please make sure you are signed in and try again.')
      } else if (msg.toLowerCase().includes('storage') || msg.toLowerCase().includes('bucket')) {
        setSubmitError('Photo upload failed. Please check your connection and try again.')
      } else {
        setSubmitError(msg || 'Failed to submit report. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-4 py-16">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#D4F547]/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-[#D4F547]" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Report Submitted!</h2>
          <p className="text-gray-400 text-sm mb-2">
            Your report for <strong className="text-white">{form.title}</strong> has been posted.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We'll notify you if someone finds a matching item. Check your dashboard for updates.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/report-lost')}>
              Report Another Item
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-white font-bold text-2xl mb-4">Report Lost Item</h1>
          <ClaimStepIndicator steps={REPORT_LOST_STEPS} currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              {step === 1 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 1: Tell us what you lost</h2>
                  <div className="flex flex-col gap-4">
                    <Input label="Item Name *" placeholder="e.g. Blue JanSport Backpack" value={form.title} onChange={(e) => update('title', e.target.value)} error={errors.title} />
                    <Select label="Category *" options={CATEGORIES} placeholder="Select category" value={form.category} onChange={(e) => update('category', e.target.value)} error={errors.category} />
                    <Input label="Brand / Model (optional)" placeholder="e.g. Apple MacBook Pro" value={form.brand_model} onChange={(e) => update('brand_model', e.target.value)} />
                    <Input label="Color" placeholder="e.g. Dark Navy Blue" value={form.color} onChange={(e) => update('color', e.target.value)} />
                    <Textarea label="Detailed Description *" placeholder="Describe the item thoroughly — size, condition, any unique marks..." rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} error={errors.description} />
                    <Textarea label="Distinguishing Features (optional)" placeholder="Each feature on a new line" rows={3} value={form.identifying_details} onChange={(e) => update('identifying_details', e.target.value)} helperText="These help verify ownership later" />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 2: Where & When</h2>
                  <div className="flex flex-col gap-4">
                    <Select label="Where Lost *" options={CAMPUS_LOCATIONS} placeholder="Select location" value={form.campus_location} onChange={(e) => update('campus_location', e.target.value)} error={errors.campus_location} />
                    <Input label="Specific Spot (optional)" placeholder="e.g. 2nd floor reading room, table near window" value={form.specific_spot} onChange={(e) => update('specific_spot', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Date Lost *" type="date" value={form.lost_date} onChange={(e) => update('lost_date', e.target.value)} error={errors.lost_date} />
                      <Input label="Time Lost (optional)" type="time" value={form.lost_time} onChange={(e) => update('lost_time', e.target.value)} />
                    </div>
                    <Textarea
                      label="Private Verification Info *"
                      placeholder="Describe something unique only the true owner would know (e.g. scratched serial number, photo inside wallet)"
                      rows={3}
                      value={form.private_verification}
                      onChange={(e) => update('private_verification', e.target.value)}
                      error={errors.private_verification}
                      helperText="🔒 This is kept private and used only to verify ownership claims"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 3: Add Photos</h2>
                  <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-8 hover:border-[#D4F547]/50 transition-colors text-center">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" />
                    <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-3">
                      {photoPreview ? (
                        <img src={photoPreview} alt="preview" className="w-40 h-40 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-[#D4F547]/10 rounded-xl flex items-center justify-center">
                          <Upload size={24} className="text-[#D4F547]" />
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">
                          {photoPreview ? photoFile?.name : 'Click to upload a photo'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">PNG, JPG accepted</p>
                      </div>
                    </label>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 4: Review & Submit</h2>
                  {submitError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
                      <p className="text-red-400 text-sm">{submitError}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {[
                      ['Item Name', form.title],
                      ['Category', form.category],
                      ['Color', form.color],
                      ['Location', form.campus_location],
                      ['Date Lost', form.lost_date],
                      ['Has Photo', photoFile ? 'Yes' : 'No'],
                    ].map(([label, value]) => value ? (
                      <div key={label} className="flex justify-between py-2 border-b border-[#2a2a2a]">
                        <span className="text-gray-500 text-sm">{label}</span>
                        <span className="text-white text-sm capitalize">{value}</span>
                      </div>
                    ) : null)}
                    <p className="text-gray-600 text-xs mt-4">
                      By submitting, you confirm all information is accurate and truthful.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#1a1a1a] border border-[#D4F547]/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-[#D4F547]" />
                <h3 className="text-white font-semibold text-sm">Reporting Tips</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Be as specific as possible — detailed reports get matched 3× faster.',
                  'Include any unique identifiers like serial numbers, stickers, or personalizations.',
                  'The private verification field is only seen by admins to verify ownership.',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-gray-400 text-xs leading-relaxed">
                    <span className="text-[#D4F547] font-bold flex-shrink-0">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
          ) : <div />}
          {step < 4 ? (
            <Button variant="primary" onClick={nextStep} icon={<ChevronRight size={16} />}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              Submit Report
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
