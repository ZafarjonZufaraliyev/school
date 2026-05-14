import { apiService } from './api.service'

export const groupsService = {
  getAll: (params) => apiService.get('/groups/', params),
  getById: (id) => apiService.get(`/groups/${id}/`),
  create: (payload) => apiService.post('/groups/', payload),
  update: (id, payload) => apiService.put(`/groups/${id}/`, payload),
  delete: (id) => apiService.delete(`/groups/${id}/`),
  getStudents: (id) => apiService.get(`/groups/${id}/students/`),
  getSubjects: (id) => apiService.get(`/groups/${id}/subjects/`),
  getSchedule: (id) => apiService.get(`/groups/${id}/schedule/`),
  getStats: (id) => apiService.get(`/groups/${id}/statistics/`),
}
