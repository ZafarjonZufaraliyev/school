import { apiService } from './api.service'

export const attendanceService = {
  scan: (qrCode) => apiService.post('/attendance/scan', { qr_code: qrCode }),
  manualCheckin: (userId) => apiService.post('/attendance/checkin', { user_id: userId }),
  manualCheckout: (userId) => apiService.post('/attendance/checkout', { user_id: userId }),
  getLive: () => apiService.get('/attendance/live'),
  getDaily: (date) => apiService.get('/attendance/report/daily', { date }),
  getByUser: (userId, params = {}) => apiService.get(`/attendance/user/${userId}`, params),
  getSummary: (params = {}) => apiService.get('/attendance/report/summary', params),
  getStats: () => apiService.get('/attendance/stats'),
}
