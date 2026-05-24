import { apiService } from './api.service'

export const notificationsService = {
  getAll: () => apiService.get('/notifications'),
  markRead: (id) => apiService.post(`/notifications/${id}/read`),
  markAllRead: () => apiService.post('/notifications/read-all'),
  delete: (id) => apiService.delete(`/notifications/${id}`),
}
