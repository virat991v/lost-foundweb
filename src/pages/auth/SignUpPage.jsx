import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-[#D4F547] rounded-xl flex items-center justify-center">
        <Search size={22} className="text-black" />
      </div>
      <p className="text-white font-bold text-lg tracking-tight">lost-found</p>
    </div>
  )
}

export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate() {
    const e = {}
    if (!fullName.trim()) e.fullName = 'Full name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address'
    if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) e.phone = 'Please enter a valid phone number'
    if (password.length < 8) e.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, fullName, phone)
      setSuccess(true)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('over_email_send_rate_limit')) {
        setError('Too many sign-up attempts. Please wait a few minutes and try again.')
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('user already registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else {
        setError(msg || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      >
        <div className="w-full max-w-sm">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            {/* Green tick */}
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="text-white font-bold text-xl mb-2">Account Created!</h2>
            <p className="text-gray-400 text-sm mb-2">
              A verification link has been sent to
            </p>
            <p className="text-white font-semibold text-sm mb-6">{email}</p>

            <p className="text-gray-500 text-xs mb-6">
              Open Gmail, find the email from lost-found and click the link to activate your account. Check spam if you don't see it.
            </p>

            <Link
              to="/login"
              className="inline-block bg-[#D4F547] text-black font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#c2e040] transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: '32px 32px' }}
    >
      <div className="w-full max-w-sm">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <Logo />

          <div className="text-center mb-6">
            <h1 className="text-white font-bold text-xl mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Join your campus Lost &amp; Found hub</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Mercer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.fullName}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
              autoComplete="email"
            />
            <Input
              label="Phone Number (optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
              autoComplete="tel"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors pr-10 ${fieldErrors.password ? 'border-red-500' : 'border-[#2a2a2a]'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors pr-10 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-[#2a2a2a]'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-xs text-red-400">{fieldErrors.confirmPassword}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D4F547] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
