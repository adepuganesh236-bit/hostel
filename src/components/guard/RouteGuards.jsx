import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import { useAuth } from '../../context/AuthContext'

// Redirects unauthenticated users to login (preserving intended destination)
export default function RequireAuth({ children }) {
  const { role, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner full label="Checking your session…" />
  if (!role) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

// Requires a specific role; sends users to their own dashboard otherwise
export function RequireRole({ role: required, children }) {
  const { role, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner full label="Checking permissions…" />
  if (!role) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  if (role !== required) {
    const map = {
      student: '/student/dashboard',
      owner: '/owner/dashboard',
      // The owner panel is the primary management role; any legacy admin
      // account is redirected there instead of a (removed) admin panel.
      admin: '/owner/dashboard',
    }
    return <Navigate to={map[role]} replace />
  }
  return children
}