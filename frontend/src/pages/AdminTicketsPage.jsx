import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchTickets } from '../api/adminApi'
import EmptyState from '../components/EmptyState'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import TicketCard from '../components/TicketCard'
import { labelFor } from '../utils/format'
import { PRIORITIES, STATUSES, readApiError } from '../utils/validators'

const EMPTY_FILTERS = { title: '', status: '', priority: '' }

export default function AdminTicketsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  function load(nextFilters) {
    setLoading(true)
    setMessage('')
    searchTickets(nextFilters)
      .then((data) => {
        setResult(data)
        setApplied(nextFilters)
      })
      .catch((error) => {
        setResult(null)
        setMessage(readApiError(error).message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(EMPTY_FILTERS)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    load(filters)
  }

  const activeParts = []
  if (applied.title.trim()) {
    activeParts.push(`Title: ${applied.title.trim()}`)
  }
  if (applied.status) {
    activeParts.push(`Status: ${labelFor(applied.status)}`)
  }
  if (applied.priority) {
    activeParts.push(`Priority: ${labelFor(applied.priority)}`)
  }

  return (
    <PageShell>
      <PageHeader
        title="All Tickets"
        subtitle="Review and manage support requests across all users."
        action={
          <Link className="btn btn-outline-secondary" to="/admin">
            Back to admin
          </Link>
        }
      />
      <form className="filter-card" onSubmit={handleSubmit}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="title">
              Search
            </label>
            <input
              id="title"
              className="form-control"
              placeholder="Search tickets by title..."
              value={filters.title}
              onChange={(event) => setFilters({ ...filters, title: event.target.value })}
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={filters.status}
              onChange={(event) => setFilters({ ...filters, status: event.target.value })}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {labelFor(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="form-select"
              value={filters.priority}
              onChange={(event) => setFilters({ ...filters, priority: event.target.value })}
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {labelFor(priority)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2">
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>
      {activeParts.length > 0 && <p className="active-filters">{activeParts.join(' · ')}</p>}
      {loading && <LoadingSpinner label="Loading tickets" />}
      {!loading && message && <ErrorAlert message={message} onRetry={() => load(filters)} />}
      {!loading && result && result.tickets.length === 0 && (
        <EmptyState title="No tickets match these filters." />
      )}
      {!loading && result && result.tickets.length > 0 && (
        <div className="ticket-list">
          <div className="admin-list-head" aria-hidden="true">
            <span>Title</span>
            <span>Priority</span>
            <span>Category</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          {result.tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              to={`/tickets/${ticket.id}`}
              linkState={{ from: 'admin' }}
              showOwner
            />
          ))}
        </div>
      )}
      {!loading && result && result.total > 0 && (
        <p className="result-count">
          {result.total} ticket{result.total === 1 ? '' : 's'}
        </p>
      )}
    </PageShell>
  )
}
