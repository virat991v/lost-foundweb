import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Upload, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { foundItemsService } from '../../services/items/foundItemsService'
import ClaimStepIndicator from '../../components/claims/ClaimStepIndicator'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { CATEGORIES, CAMPUS_LOCATIONS, REPORT_FOUND_STEPS } from '../../utils/constants'

const initialForm = {
  title: '', category: '', brand_model: '', color: '', description: '',
  campus_location: '', specific_spot: '', found_date: '', found_time: '', current_location: '',
}

export default function ReportFoundPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

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
    if (!form.found_date) e.found_date = 'Date is required'
    if (!form.current_location.trim()) e.current_location = 'Current location of item is required'
    return e
  }

  function nextStep() {
    const e = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {}
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await foundItemsService.create({ ...form, user_id: user.id }, photoFile)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-white font-bold text-2xl mb-4">Report Found Item</h1>
          <ClaimStepIndicator steps={REPORT_FOUND_STEPS} currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              {step === 1 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 1: Describe what you found</h2>
                  <div className="flex flex-col gap-4">
                    <Input label="Item Name *" placeholder="e.g. Black Leather Wallet" value={form.title} onChange={(e) => update('title', e.target.value)} error={errors.title} />
                    <Select label="Category *" options={CATEGORIES} placeholder="Select category" value={form.category} onChange={(e) => update('category', e.target.value)} error={errors.category} />
                    <Input label="Brand / Model (optional)" placeholder="e.g. Samsung Galaxy" value={form.brand_model} onChange={(e) => update('brand_model', e.target.value)} />
                    <Input label="Color" placeholder="e.g. Black" value={form.color} onChange={(e) => update('color', e.target.value)} />
                    <Textarea label="Detailed Description *" placeholder="Describe the item to help the owner identify it..." rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} error={errors.description} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 2: Where & When Found</h2>
                  <div className="flex flex-col gap-4">
                    <Select label="Where Found *" options={CAMPUS_LOCATIONS} placeholder="Select location" value={form.campus_location} onChange={(e) => update('campus_location', e.target.value)} error={errors.campus_location} />
                    <Input label="Specific Spot (optional)" placeholder="e.g. Table 12, 2nd floor" value={form.specific_spot} onChange={(e) => update('specific_spot', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Date Found *" type="date" value={form.found_date} onChange={(e) => update('found_date', e.target.value)} error={errors.found_date} />
                      <Input label="Time Found (optional)" type="time" value={form.found_time} onChange={(e) => update('found_time', e.target.value)} />
                    </div>
                    <Input
                      label="Current Location of Item *"
                      placeholder="e.g. Turned in to Library front desk"
                      value={form.current_location}
                      onChange={(e) => update('current_location', e.target.value)}
                      error={errors.current_location}
                    />
                    <div className="flex items-start gap-3 bg-[#D4F547]/5 border border-[#D4F547]/10 rounded-lg px-4 py-3">
                      <Heart size={18} className="text-[#D4F547] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">
                        Thank you for helping a fellow student! Your honest report goes a long way.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 3: Add Photos</h2>
                  <div className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-8 text-center hover:border-[#D4F547]/50 transition-colors">
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)) }
                    }} className="hidden" id="found-photo" />
                    <label htmlFor="found-photo" className="cursor-pointer flex flex-col items-center gap-3">
                      {photoPreview ? (
                        <img src={photoPreview} alt="preview" className="w-40 h-40 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-[#D4F547]/10 rounded-xl flex items-center justify-center">
                          <Upload size={24} className="text-[#D4F547]" />
                        </div>
                      )}
                      <p className="text-white text-sm">{photoPreview ? photoFile?.name : 'Upload photo'}</p>
                      <p className="text-gray-500 text-xs">Helps the owner identify it faster</p>
                    </label>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-white font-semibold mb-5">Step 4: Review & Submit</h2>
                  <div className="space-y-3">
                    {[
                      ['Item Name', form.title],
                      ['Category', form.category],
                      ['Found At', form.campus_location],
                      ['Date Found', form.found_date],
                      ['Current Location', form.current_location],
                      ['Has Photo', photoFile ? 'Yes' : 'No'],
                    ].map(([label, value]) => value ? (
                      <div key={label} className="flex justify-between py-2 border-b border-[#2a2a2a]">
                        <span className="text-gray-500 text-sm">{label}</span>
                        <span className="text-white text-sm capitalize">{value}</span>
                      </div>
                    ) : null)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#D4F547]/10 rounded flex items-center justify-center">
                  <Heart size={14} className="text-[#D4F547]" />
                </div>
                <h3 className="text-white font-semibold text-sm">Secure Hand-off</h3>
              </div>
              <ul className="space-y-2.5 text-gray-400 text-xs leading-relaxed">
                <li>Your contact info stays private until admin verifies ownership.</li>
                <li>The finder and owner meet at a designated campus safe zone.</li>
                <li>Both parties must confirm the handoff is complete.</li>
              </ul>
            </div>
          </div>
        </div>

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
