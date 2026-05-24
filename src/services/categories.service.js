import { apiService } from './api.service'

export const categoriesService = {
  getAll: () => apiService.get('/categories'),
  create: (payload) => apiService.post('/categories', payload),
  update: (id, payload) => apiService.put(`/categories/${id}`, payload),
  delete: (id) => apiService.delete(`/categories/${id}`),
}

export const classesService = {
  getAll: (params = {}) => apiService.get('/classes', params),
  create: (payload) => apiService.post('/classes', payload),
  update: (id, payload) => apiService.put(`/classes/${id}`, payload),
  delete: (id) => apiService.delete(`/classes/${id}`),
}
