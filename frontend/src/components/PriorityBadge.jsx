import { labelFor } from '../utils/format'

const PRIORITY_CLASS = {
  LOW: 'priority-low',
  MEDIUM: 'priority-medium',
  HIGH: 'priority-high',
}

export default function PriorityBadge({ priority }) {
  return <span className={`badge-pill ${PRIORITY_CLASS[priority] || 'priority-low'}`}>{labelFor(priority)}</span>
}
