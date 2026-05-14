import { apiService } from './api.service'

export const assignmentsService = {
  getAll: (params) => apiService.get('/assignments/', params),
  getById: (id) => apiService.get(`/assignments/${id}/`),
  create: (payload) => apiService.post('/assignments/', payload),
  update: (id, payload) => apiService.put(`/assignments/${id}/`, payload),
  delete: (id) => apiService.delete(`/assignments/${id}/`),
  toggleUpload: (id, payload) => apiService.patch(`/assignments/${id}/toggle-upload/`, payload),
  submit: (id, formData) => apiService.postForm(`/assignments/${id}/submit/`, formData),
  getSubmissions: (id) => apiService.get(`/assignments/${id}/submissions/`),
  gradeSubmission: (id, payload) => apiService.patch(`/submissions/${id}/grade/`, payload),
}
