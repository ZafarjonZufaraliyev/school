import { apiService } from './api.service'

export const scheduleService = {
  getAll: (params) => apiService.get('/schedule/', params),
  create: (payload) => apiService.post('/schedule/', payload),
  update: (id, payload) => apiService.put(`/schedule/${id}/`, payload),
  delete: (id) => apiService.delete(`/schedule/${id}/`),
}
