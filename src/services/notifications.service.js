import { apiService } from './api.service'

export const notificationsService = {
  getAll: () => apiService.get('/notifications/'),
  markRead: (id) => apiService.patch(`/notifications/${id}/read/`),
  markAllRead: () => apiService.post('/notifications/mark-all-read/'),
  delete: (id) => apiService.delete(`/notifications/${id}/`),
}
