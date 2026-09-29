import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listTickets } from '../api/ticketApi'
import EmptyState from '../components/EmptyState'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import TicketCard from '../components/TicketCard'
import { readApiError } from '../utils/validators'

export default function TicketListPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  function loadTickets() {
    setLoading(true)
    setMessage('')
    listTickets()
      .then(setTickets)
      .catch((error) => setMessage(readApiError(error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTickets()
  }, [])

  return (
    <PageShell>
      <PageHeader
        title="My Tickets"
        subtitle="Track and manage your support requests."
        action={
          <Link className="btn btn-primary" to="/tickets/new">
            New ticket
          </Link>
        }
      />
      {loading && <LoadingSpinner label="Loading tickets" />}
      {!loading && message && <ErrorAlert message={message} onRetry={loadTickets} />}
      {!loading && !message && tickets.length === 0 && (
        <EmptyState
          title="No support tickets yet."
          action={
            <Link className="btn btn-primary" to="/tickets/new">
              Create your first ticket
            </Link>
          }
        >
          You haven't created any support tickets yet.
        </EmptyState>
      )}
      {!loading && !message && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} to={`/tickets/${ticket.id}`} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
