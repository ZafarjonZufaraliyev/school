import { apiService } from './api.service'

export const authService = {
  login: (credentials) => apiService.post('/auth/token/', credentials),
  logout: (payload) => apiService.post('/auth/token/blacklist/', payload),
  getProfile: () => apiService.get('/auth/me/'),
  changePassword: (payload) => apiService.post('/auth/change-password/', payload),
  changeLogin: (payload) => apiService.post('/auth/change-username/', payload),
}
