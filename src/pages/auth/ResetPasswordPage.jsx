import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setLoading(true)
    try {
      await updatePassword(password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message ?? 'Failed to update password.')
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

          <div className="text-center mb-6">
            <h1 className="text-white font-bold text-xl mb-1">Set new password</h1>
            <p className="text-gray-500 text-sm">Choose a strong password for your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
