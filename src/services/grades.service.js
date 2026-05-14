import { apiService } from './api.service'

export const gradesService = {
  getAll: (params) => apiService.get('/grades/', params),
  create: (payload) => apiService.post('/grades/', payload),
  update: (id, payload) => apiService.put(`/grades/${id}/`, payload),
  bulkSave: (payload) => apiService.post('/grades/bulk-save/', payload),
  getStudentGrades: (studentId) => apiService.get(`/grades/student/${studentId}/`),
  getGroupGrades: (groupId, p) => apiService.get(`/grades/group/${groupId}/`, p),
  getWeeklyResults: (params) => apiService.get('/grades/weekly/', params),
}
