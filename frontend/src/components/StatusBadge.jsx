import { labelFor } from '../utils/format'

const STATUS_CLASS = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-progress',
  RESOLVED: 'status-resolved',
}

export default function StatusBadge({ status }) {
  return <span className={`badge-pill ${STATUS_CLASS[status] || 'priority-low'}`}>{labelFor(status)}</span>
}
