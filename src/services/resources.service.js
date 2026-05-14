import { apiService } from './api.service'

export const resourcesService = {
  getAll: (params) => apiService.get('/resources/', params),
  getById: (id) => apiService.get(`/resources/${id}/`),
  create: (formData) => apiService.postForm('/resources/', formData),
  update: (id, formData) => apiService.postForm(`/resources/${id}/`, formData),
  delete: (id) => apiService.delete(`/resources/${id}/`),
  download: (id) => apiService.get(`/resources/${id}/download/`),
}
