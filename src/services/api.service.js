import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
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
    this.client.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true
          try {
            const refresh = localStorage.getItem('refresh_token')
            const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
            localStorage.setItem('access_token', data.access)
            this.setToken(data.access)
            original.headers['Authorization'] = `Bearer ${data.access}`
            return this.client(original)
          } catch {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      },
    )
  }

  get(url, params = {}) {
    return this.client.get(url, { params })
  }
  post(url, data) {
    return this.client.post(url, data)
  }
  put(url, data) {
    return this.client.put(url, data)
  }
  patch(url, data) {
    return this.client.patch(url, data)
  }
  delete(url) {
    return this.client.delete(url)
  }
  postForm(url, formData) {
    return this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}

export const apiService = new ApiService()
