import { apiService } from './api.service'

export const subjectsService = {
  getAll: (params) => apiService.get('/subjects/', params),
  getById: (id) => apiService.get(`/subjects/${id}/`),
  create: (payload) => apiService.post('/subjects/', payload),
  update: (id, payload) => apiService.put(`/subjects/${id}/`, payload),
  delete: (id) => apiService.delete(`/subjects/${id}/`),
}
