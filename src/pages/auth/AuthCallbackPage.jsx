import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search } from 'lucide-react'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Processing your verification…')
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleCallback() {
      // Supabase embeds the token in the URL hash (#access_token=...) or as query params
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setError('Verification failed: ' + (error.message || 'Unknown error'))
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (data?.session) {
        setStatus('Email verified! Redirecting to dashboard…')
        setTimeout(() => navigate('/dashboard', { replace: true }), 1200)
      } else {
        // Try exchanging hash tokens (Supabase PKCE flow)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          setStatus('Activating your account…')
          // onAuthStateChange in AuthContext will pick up the session automatically
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500)
        } else {
          setStatus('Redirecting to sign in…')
          setTimeout(() => navigate('/login', { replace: true }), 1200)
        }
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }}
    >
      <div className="w-full max-w-sm text-center">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-10 shadow-2xl">
          <div className="w-12 h-12 bg-[#D4F547] rounded-xl flex items-center justify-center mx-auto mb-5">
            <Search size={22} className="text-black" />
          </div>
          <p className="text-white font-bold text-lg mb-1">lost-found</p>

          {error ? (
            <>
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mt-6 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-gray-500 text-xs mt-2">Redirecting to sign in…</p>
            </>
          ) : (
            <>
              <div className="mt-6 mb-5 flex justify-center">
                <span className="w-8 h-8 border-2 border-[#D4F547] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-300 text-sm">{status}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
