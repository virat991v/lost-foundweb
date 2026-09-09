import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message ?? 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
      style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: '32px 32px' }}
    >
      <div className="w-full max-w-sm">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4F547] rounded-xl flex items-center justify-center">
              <Search size={22} className="text-black" />
            </div>
            <p className="text-white font-bold text-lg">lost-found</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-[#D4F547]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4F547" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Check your inbox</h2>
              <p className="text-gray-400 text-sm mb-6">
                We sent a password reset link to <strong className="text-white">{email}</strong>.
              </p>
              <Link to="/login" className="text-[#D4F547] text-sm hover:underline flex items-center justify-center gap-1.5">
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-white font-bold text-xl mb-1">Reset your password</h1>
                <p className="text-gray-500 text-sm">Enter your email address to receive a reset link</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link to="/login" className="text-gray-500 text-sm hover:text-white flex items-center justify-center gap-1.5 transition-colors">
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
