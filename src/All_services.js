// ═══════════════════════════════════════════════════════════════
// src/services/api.service.js  — Axios instance with JWT handling
// ═══════════════════════════════════════════════════════════════
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    })

    this._setupInterceptors()
  }

  setToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearToken() {
    delete this.client.defaults.headers.common['Authorization']
  }

  _setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    )

    // Response interceptor — auto refresh JWT
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const original = error.config
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true
          try {
            const refreshToken = localStorage.getItem('refresh_token')
            const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken
            })
            localStorage.setItem('access_token', data.access)
            this.setToken(data.access)
            original.headers['Authorization'] = `Bearer ${data.access}`
            return this.client(original)
          } catch {
            // Refresh failed — logout
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  get(url, params = {}) { return this.client.get(url, { params }) }
  post(url, data) { return this.client.post(url, data) }
  put(url, data) { return this.client.put(url, data) }
  patch(url, data) { return this.client.patch(url, data) }
  delete(url) { return this.client.delete(url) }
  postForm(url, formData) {
    return this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const apiService = new ApiService()


// ═══════════════════════════════════════════════════════════════
// src/services/auth.service.js
// ═══════════════════════════════════════════════════════════════
export const authService = {
  login: (credentials) => apiService.post('/auth/token/', credentials),
  logout: (payload) => apiService.post('/auth/token/blacklist/', payload),
  getProfile: () => apiService.get('/auth/me/'),
  changePassword: (payload) => apiService.post('/auth/change-password/', payload),
  changeLogin: (payload) => apiService.post('/auth/change-username/', payload),
}


// ═══════════════════════════════════════════════════════════════
// src/services/users.service.js
// ═══════════════════════════════════════════════════════════════
export const usersService = {
  getAll: (params) => apiService.get('/users/', params),
  getById: (id) => apiService.get(`/users/${id}/`),
  create: (payload) => apiService.post('/users/', payload),
  update: (id, payload) => apiService.put(`/users/${id}/`, payload),
  delete: (id) => apiService.delete(`/users/${id}/`),
}


// ═══════════════════════════════════════════════════════════════
// src/services/groups.service.js
// ═══════════════════════════════════════════════════════════════
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


// ═══════════════════════════════════════════════════════════════
// src/services/assignments.service.js
// ═══════════════════════════════════════════════════════════════
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


// ═══════════════════════════════════════════════════════════════
// src/services/attendance.service.js
// ═══════════════════════════════════════════════════════════════
export const attendanceService = {
  getAll: (params) => apiService.get('/attendance/', params),
  save: (payload) => apiService.post('/attendance/bulk-save/', payload),
  getStudentAttendance: (studentId, params) =>
    apiService.get(`/attendance/student/${studentId}/`, params),
  getGroupStats: (groupId, params) =>
    apiService.get(`/attendance/group/${groupId}/stats/`, params),
}


// ═══════════════════════════════════════════════════════════════
// src/services/resources.service.js
// ═══════════════════════════════════════════════════════════════
export const resourcesService = {
  getAll: (params) => apiService.get('/resources/', params),
  getById: (id) => apiService.get(`/resources/${id}/`),
  create: (formData) => apiService.postForm('/resources/', formData),
  update: (id, formData) => apiService.postForm(`/resources/${id}/`, formData),
  delete: (id) => apiService.delete(`/resources/${id}/`),
  download: (id) => apiService.get(`/resources/${id}/download/`),
}


// ═══════════════════════════════════════════════════════════════
// src/services/grades.service.js
// ═══════════════════════════════════════════════════════════════
export const gradesService = {
  getAll: (params) => apiService.get('/grades/', params),
  create: (payload) => apiService.post('/grades/', payload),
  update: (id, payload) => apiService.put(`/grades/${id}/`, payload),
  bulkSave: (payload) => apiService.post('/grades/bulk-save/', payload),
  getStudentGrades: (studentId) => apiService.get(`/grades/student/${studentId}/`),
  getGroupGrades: (groupId, params) => apiService.get(`/grades/group/${groupId}/`, params),
  getWeeklyResults: (params) => apiService.get('/grades/weekly/', params),
}


// ═══════════════════════════════════════════════════════════════
// src/services/schedule.service.js
// ═══════════════════════════════════════════════════════════════
export const scheduleService = {
  getAll: (params) => apiService.get('/schedule/', params),
  create: (payload) => apiService.post('/schedule/', payload),
  update: (id, payload) => apiService.put(`/schedule/${id}/`, payload),
  delete: (id) => apiService.delete(`/schedule/${id}/`),
}