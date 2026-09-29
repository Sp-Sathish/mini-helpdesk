export function formatDateTime(value) {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function labelFor(value) {
  if (!value) {
    return ''
  }
  if (value === 'IN_PROGRESS') {
    return 'In progress'
  }
  return value.charAt(0) + value.slice(1).toLowerCase()
}
