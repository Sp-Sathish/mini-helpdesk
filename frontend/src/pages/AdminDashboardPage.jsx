import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTicketStats } from '../api/adminApi'
import EmptyState from '../components/EmptyState'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import StatCard from '../components/StatCard'
import { readApiError } from '../utils/validators'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  function loadStats() {
    setLoading(true)
    setMessage('')
    getTicketStats()
      .then(setStats)
      .catch((error) => setMessage(readApiError(error).message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <PageShell>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor support activity and ticket status."
        action={
          <Link className="btn btn-primary" to="/admin/tickets">
            View all tickets
          </Link>
        }
      />
      {loading && <LoadingSpinner label="Loading statistics" />}
      {!loading && message && <ErrorAlert message={message} onRetry={loadStats} />}
      {!loading && stats && (
        <>
          <div className="stat-grid">
            <StatCard label="Total Tickets" value={stats.total} hint="All support cases" tone="total" />
            <StatCard label="Open" value={stats.open} hint="Waiting to be handled" tone="open" />
            <StatCard label="In Progress" value={stats.inProgress} hint="Currently being worked" tone="progress" />
            <StatCard label="Resolved" value={stats.resolved} hint="Finished cases" tone="resolved" />
          </div>
          {stats.total === 0 && (
            <div className="mt-3">
              <EmptyState title="No support tickets yet.">No tickets have been created yet.</EmptyState>
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
