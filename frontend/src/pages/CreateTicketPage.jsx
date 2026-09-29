import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTicket } from '../api/ticketApi'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import { labelFor } from '../utils/format'
import { CATEGORY_OPTIONS, PRIORITIES, readApiError, showFormMessage, validateTicket } from '../utils/validators'

export default function CreateTicketPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryChoice, setCategoryChoice] = useState('TECHNICAL')
  const [customCategory, setCustomCategory] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const category = categoryChoice === 'OTHER' ? customCategory : categoryChoice

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateTicket({ title, description, category, priority })
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    setSubmitting(true)
    try {
      const ticket = await createTicket({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        priority,
      })
      navigate(`/tickets/${ticket.id}`, { replace: true })
    } catch (error) {
      const apiError = readApiError(error)
      setErrors(apiError.errors)
      setMessage(apiError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell narrow>
      <PageHeader title="Create a support ticket" subtitle="Tell us what you need help with." />
      <form className="panel form-card" onSubmit={handleSubmit} noValidate>
        {showFormMessage(message, errors) && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        <p className="form-note mb-3">Fields marked with * are required.</p>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Title
            <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            aria-invalid={errors.title ? 'true' : undefined}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Description
            <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <textarea
            id="description"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            aria-invalid={errors.description ? 'true' : undefined}
            rows="6"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="category">
            Category
            <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <select
            id="category"
            className="form-select"
            value={categoryChoice}
            onChange={(event) => setCategoryChoice(event.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {labelFor(option)}
              </option>
            ))}
            <option value="OTHER">Other</option>
          </select>
          {categoryChoice === 'OTHER' && (
            <input
              id="customCategory"
              className={`form-control mt-2 ${errors.category ? 'is-invalid' : ''}`}
              aria-label="Custom category"
              aria-invalid={errors.category ? 'true' : undefined}
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
            />
          )}
          {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="priority">
            Priority
            <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <select
            id="priority"
            className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
            aria-invalid={errors.priority ? 'true' : undefined}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITIES.map((option) => (
              <option key={option} value={option}>
                {labelFor(option)}
              </option>
            ))}
          </select>
          {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
        </div>
        <div className="form-actions">
          <Link className="btn btn-outline-secondary" to="/tickets">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
            {submitting ? 'Creating ticket...' : 'Create ticket'}
          </button>
        </div>
      </form>
    </PageShell>
  )
}
