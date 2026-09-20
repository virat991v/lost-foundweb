import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search } from 'lucide-react'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Verifying your email…')
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))

        // PKCE flow: Supabase sends ?code= in the URL
        const code = params.get('code')
        // Implicit flow: Supabase sends #access_token= in the hash
        const accessToken = hashParams.get('access_token')
        const errorParam = params.get('error') || hashParams.get('error')
        const errorDesc = params.get('error_description') || hashParams.get('error_description')

        if (errorParam) {
          setError(errorDesc || errorParam)
          setTimeout(() => navigate('/login', { replace: true }), 3000)
          return
        }

        if (code) {
          // PKCE — exchange code for session
          setStatus('Activating your account…')
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError(exchangeError.message)
            setTimeout(() => navigate('/login', { replace: true }), 3000)
            return
          }
          setStatus('Email verified! Redirecting…')
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000)
          return
        }

        if (accessToken) {
          // Implicit / legacy — session is set automatically by detectSessionInUrl
          setStatus('Email verified! Redirecting…')
          // Give Supabase a moment to process the hash
          setTimeout(() => navigate('/dashboard', { replace: true }), 1200)
          return
        }

        // No token — check if session already exists (e.g. already confirmed)
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          setStatus('Already signed in. Redirecting…')
          setTimeout(() => navigate('/dashboard', { replace: true }), 800)
        } else {
          setStatus('No verification token found. Redirecting to sign in…')
          setTimeout(() => navigate('/login', { replace: true }), 1500)
        }
      } catch (err) {
        setError('Verification failed: ' + (err.message || 'Unknown error'))
        setTimeout(() => navigate('/login', { replace: true }), 3000)
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
        <div className="animate-scale-in bg-[#111111] border border-[#2a2a2a] rounded-2xl p-10 shadow-2xl">
          <div className="w-12 h-12 bg-[#D4F547] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search size={22} className="text-black" />
          </div>
          <p className="text-white font-bold text-lg mb-6">lost-found</p>

          {error ? (
            <>
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-2">{error}</p>
              <p className="text-gray-500 text-xs">Redirecting to sign in…</p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
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
