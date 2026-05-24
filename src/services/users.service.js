import { apiService } from './api.service'

export const usersService = {
  getAll: (params) => apiService.get('/users', params),
  getById: (id) => apiService.get(`/users/${id}`),
  create: (payload) => apiService.post('/users', payload),
  update: (id, payload) => apiService.put(`/users/${id}`, payload),
  delete: (id) => apiService.delete(`/users/${id}`),
  getQr: (id) => apiService.get(`/users/${id}/qr`),
  regenerateQr: (id) => apiService.post(`/users/${id}/qr/regenerate`),
}
