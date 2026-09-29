import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function GuestRoute({ children }) {
  const { user, ready } = useAuth()
  if (!ready) {
    return <LoadingSpinner />
  }
  if (user) {
    return <Navigate to="/tickets" replace />
  }
  return children
}
