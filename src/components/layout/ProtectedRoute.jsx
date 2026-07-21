import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../ui/Spinner'

export default function ProtectedRoute() {
  const { staff, loading } = useAuth()
  if (loading) return <Spinner fullScreen />
  if (!staff)  return <Navigate to="/login" replace />
  return <Outlet />
}
