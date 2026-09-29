import { Link } from 'react-router-dom'
import { formatDateTime } from '../utils/format'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

export default function TicketCard({ ticket, to, linkState, showOwner = false }) {
  return (
    <Link className={`ticket-card${showOwner ? ' ticket-card-admin' : ''}`} to={to} state={linkState}>
      <span className="ticket-card-title">{ticket.title}</span>
      <span className="ticket-card-status">
        <StatusBadge status={ticket.status} />
      </span>
      <span className="ticket-card-priority">
        <PriorityBadge priority={ticket.priority} />
      </span>
      <span className="ticket-card-category">{ticket.category}</span>
      {showOwner && <span className="ticket-card-owner">{ticket.owner.fullName}</span>}
      <span className="ticket-card-updated">
        {showOwner ? formatDateTime(ticket.updatedAt) : `Last updated: ${formatDateTime(ticket.updatedAt)}`}
      </span>
    </Link>
  )
}
