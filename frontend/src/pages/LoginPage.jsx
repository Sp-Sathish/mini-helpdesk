import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { readApiError, showFormMessage, validateLogin } from '../utils/validators'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const notice = location.state?.notice || ''

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateLogin({ email, password })
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/tickets', { replace: true })
    } catch (error) {
      const apiError = readApiError(error)
      setErrors(apiError.errors)
      setMessage(apiError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Support made simple."
      footer={
        <>
          Don't have an account? <Link to="/register">Create account</Link>
        </>
      }
    >
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      {showFormMessage(message, errors) && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            aria-invalid={errors.email ? 'true' : undefined}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            aria-invalid={errors.password ? 'true' : undefined}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
