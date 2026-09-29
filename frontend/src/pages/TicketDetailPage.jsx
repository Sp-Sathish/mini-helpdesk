import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { deleteTicket, getTicket, updateTicketStatus } from '../api/ticketApi'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import PageShell from '../components/PageShell'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, labelFor } from '../utils/format'
import { STATUSES, readApiError } from '../utils/validators'

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const fromAdmin = location.state?.from === 'admin'
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState('OPEN')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function loadTicket() {
    setLoading(true)
    setMessage('')
    getTicket(id)
      .then((data) => {
        setTicket(data)
        setStatus(data.status)
      })
      .catch((error) => {
        setTicket(null)
        setMessage(readApiError(error).message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTicket()
  }, [id])

  async function handleStatus(event) {
    event.preventDefault()
    if (!ticket || status === ticket.status) {
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const updated = await updateTicketStatus(ticket.id, status)
      setTicket(updated)
      setStatus(updated.status)
    } catch (error) {
      setMessage(readApiError(error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setMessage('')
    try {
      await deleteTicket(ticket.id)
      navigate('/tickets', { replace: true })
    } catch (error) {
      setMessage(readApiError(error).message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <LoadingSpinner label="Loading ticket" />
      </PageShell>
    )
  }

  if (!ticket) {
    return (
      <PageShell>
        <ErrorAlert message={message || 'Ticket not found'} onRetry={loadTicket} />
        <Link className="back-link mt-3" to={fromAdmin ? '/admin/tickets' : '/tickets'}>
          {fromAdmin ? 'Back to all tickets' : 'Back to my tickets'}
        </Link>
      </PageShell>
    )
  }

  const canDelete = user?.id === ticket.owner?.id

  return (
    <PageShell>
      <Link className="back-link" to={fromAdmin ? '/admin/tickets' : '/tickets'}>
        {fromAdmin ? 'Back to all tickets' : 'Back to my tickets'}
      </Link>
      <div className="page-header">
        <div>
          <h1 className="ticket-card-title">{ticket.title}</h1>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <ErrorAlert message={message} />
      <div className="detail-layout">
        <section className="panel">
          <h2>Description</h2>
          <p className="ticket-description">{ticket.description}</p>
          <h2>Ticket information</h2>
          <dl className="info-list">
            <div>
              <dt>Category</dt>
              <dd>{ticket.category}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>
                <PriorityBadge priority={ticket.priority} />
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={ticket.status} />
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(ticket.createdAt)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDateTime(ticket.updatedAt)}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{ticket.owner.fullName}</dd>
            </div>
          </dl>
        </section>
        <aside className="panel">
          <h2>Update status</h2>
          <form onSubmit={handleStatus}>
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-select mb-3"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUSES.map((option) => (
                <option key={option} value={option}>
                  {labelFor(option)}
                </option>
              ))}
            </select>
            <button className="btn btn-primary w-100" type="submit" disabled={saving || status === ticket.status}>
              {saving && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
              {saving ? 'Saving...' : 'Update status'}
            </button>
            <p className="form-note mt-2 mb-0">
              Title, description, category, and priority stay as they were created.
            </p>
          </form>
          <h2 className="mt-4">Owner</h2>
          <p className="mb-0">{ticket.owner.fullName}</p>
          {ticket.owner.email && <p className="form-note mb-0">{ticket.owner.email}</p>}
          {canDelete && (
            <div className="mt-4">
              <h2>Actions</h2>
              {!confirmDelete && (
                <button className="btn btn-outline-danger w-100" type="button" onClick={() => setConfirmDelete(true)}>
                  Delete ticket
                </button>
              )}
              {confirmDelete && (
                <div className="border border-danger rounded p-3">
                  <p className="mb-2">Delete this ticket? This cannot be undone.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={deleting}>
                      {deleting && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  )
}
