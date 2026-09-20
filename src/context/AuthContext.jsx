import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile from profiles table
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const meta = session.user.user_metadata ?? {}

          // On every sign-in or email confirmation:
          // Sync phone from user_metadata → profiles row.
          // This covers: first login after email confirm, re-login, OAuth.
          // Uses UPDATE (not upsert) so it only fires when a row already exists
          // (trigger creates it; UPDATE is safe without service-role).
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && meta.phone) {
            // Sync phone from user_metadata into profiles every login.
            // Runs AFTER the trigger has created the row, so UPDATE is safe.
            const { error: updateErr } = await supabase
              .from('profiles')
              .update({ phone: meta.phone })
              .eq('id', session.user.id)

            if (updateErr) {
              console.error('Phone sync error:', updateErr)
            }
          }

          const p = await fetchProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password, fullName, phone) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // phone stored in user_metadata — trigger reads it on email confirmation
        data: { full_name: fullName, phone: phone || null },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    // Profile is created by the DB trigger (handle_new_user) when email is confirmed.
    // Phone is synced on SIGNED_IN via onAuthStateChange below.
    return data
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return data
  }

  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  }

  async function refreshProfile() {
    if (user) {
      const p = await fetchProfile(user.id)
      setProfile(p)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isActive = profile?.account_status === 'active'

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isActive,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
