import axiosClient from './axiosClient'

export function listTickets() {
  return axiosClient.get('/api/tickets').then((response) => response.data)
}

export function getTicket(id) {
  return axiosClient.get(`/api/tickets/${id}`).then((response) => response.data)
}

export function createTicket(payload) {
  return axiosClient.post('/api/tickets', payload).then((response) => response.data)
}

export function updateTicketStatus(id, status) {
  return axiosClient.patch(`/api/tickets/${id}/status`, { status }).then((response) => response.data)
}

export function deleteTicket(id) {
  return axiosClient.delete(`/api/tickets/${id}`)
}
