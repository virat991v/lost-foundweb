import { useState } from 'react'
import { Upload, Lock } from 'lucide-react'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

export default function VerificationForm({ onSubmit, loading = false }) {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' })
  const [proofFile, setProofFile] = useState(null)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!answers.q1.trim()) e.q1 = 'Please describe the item'
    if (!answers.q2.trim()) e.q2 = 'Please describe distinguishing marks'
    if (!answers.q3.trim()) e.q3 = 'Please describe when/where you lost it'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSubmit?.({ answers, proofFile })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Textarea
        label="1. Describe the item in detail without looking at the listing"
        placeholder="Provide as much detail as you can remember..."
        rows={3}
        value={answers.q1}
        onChange={(e) => setAnswers((a) => ({ ...a, q1: e.target.value }))}
        error={errors.q1}
      />
      <Textarea
        label="2. What distinguishing marks or unique features does it have?"
        placeholder="Scratches, stickers, engravings, personalizations..."
        rows={3}
        value={answers.q2}
        onChange={(e) => setAnswers((a) => ({ ...a, q2: e.target.value }))}
        error={errors.q2}
      />
      <Textarea
        label="3. When and where did you lose it?"
        placeholder="Date, time, specific location..."
        rows={3}
        value={answers.q3}
        onChange={(e) => setAnswers((a) => ({ ...a, q3: e.target.value }))}
        error={errors.q3}
      />

      {/* File upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">
          4. Proof of Ownership (optional)
        </label>
        <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-4 hover:border-[#D4F547]/50 transition-colors">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            className="hidden"
            id="proof-upload"
          />
          <label
            htmlFor="proof-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload size={24} className="text-gray-600" />
            <span className="text-gray-400 text-sm">
              {proofFile ? proofFile.name : 'Upload PDF, PNG, or JPG'}
            </span>
            <span className="text-gray-600 text-xs">Click to browse</span>
          </label>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Lock size={12} />
          <span>Files are encrypted and only accessible to admins during review</span>
        </div>
      </div>

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        Submit Verification
      </Button>
    </form>
  )
}
