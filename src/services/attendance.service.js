import { apiService } from './api.service'

export const attendanceService = {
  getAll: (params) => apiService.get('/attendance/', params),
  save: (payload) => apiService.post('/attendance/bulk-save/', payload),
  getStudentAttendance: (studentId, params) =>
    apiService.get(`/attendance/student/${studentId}/`, params),
  getGroupStats: (groupId, params) => apiService.get(`/attendance/group/${groupId}/stats/`, params),
}
