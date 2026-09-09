import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../ui/Spinner'

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <PageSpinner />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Still loading profile
  if (!profile) return <PageSpinner />

  return children
}
