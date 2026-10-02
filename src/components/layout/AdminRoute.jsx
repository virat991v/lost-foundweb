import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../ui/Spinner'

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <PageSpinner />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Profile is still being fetched after auth
  if (!profile) return <PageSpinner />

  if (profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
