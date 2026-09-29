import axiosClient from './axiosClient'

export function register(payload) {
  return axiosClient.post('/api/auth/register', payload).then((response) => response.data)
}

export function login(payload) {
  return axiosClient.post('/api/auth/login', payload).then((response) => response.data)
}

export function currentUser() {
  return axiosClient.get('/api/auth/me').then((response) => response.data)
}
