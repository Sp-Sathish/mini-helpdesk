import axiosClient from './axiosClient'

export function getTicketStats() {
  return axiosClient.get('/api/admin/tickets/stats').then((response) => response.data)
}

export function searchTickets({ title, status, priority }) {
  const params = {}
  if (title.trim()) {
    params.title = title.trim()
  }
  if (status) {
    params.status = status
  }
  if (priority) {
    params.priority = priority
  }
  return axiosClient.get('/api/admin/tickets', { params }).then((response) => response.data)
}
