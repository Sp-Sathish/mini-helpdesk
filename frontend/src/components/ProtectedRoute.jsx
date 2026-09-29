import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth()
  if (!ready) {
    return <LoadingSpinner />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
