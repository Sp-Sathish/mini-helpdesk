import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import AuthLayout from '../components/AuthLayout'
import { readApiError, showFormMessage, validateRegister } from '../utils/validators'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateRegister({ fullName, email, password })
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    setSubmitting(true)
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      })
      navigate('/login', {
        replace: true,
        state: { notice: 'Account created. Sign in to continue.' },
      })
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
      title="Create your account"
      subtitle="Start managing your support requests."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {showFormMessage(message, errors) && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <p className="form-note mb-3">New accounts are created as a user.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            aria-invalid={errors.fullName ? 'true' : undefined}
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
