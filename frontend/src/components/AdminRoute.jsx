import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function AdminRoute({ children }) {
  const { user, ready } = useAuth()
  if (!ready) {
    return <LoadingSpinner />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'ADMIN') {
    return <Navigate to="/tickets" replace />
  }
  return children
}
