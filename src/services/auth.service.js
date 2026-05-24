import { apiService } from './api.service'

export const authService = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  getProfile: () => apiService.get('/auth/me'),
  changePassword: (payload) => apiService.post('/auth/change-password', payload),
}
