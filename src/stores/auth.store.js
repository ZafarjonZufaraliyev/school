import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAuthService as authService } from '@/services/mock.service'
import { apiService } from '@/services/api.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isInitialized = ref(false)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStudent = computed(() => user.value?.role === 'student')
  const userRole = computed(() => user.value?.role || null)

  async function initializeAuth() {
    if (!token.value) {
      isInitialized.value = true
      return
    }
    try {
      const { data } = await authService.getProfile()
      user.value = data
    } catch {
      clearAuth()
    } finally {
      isInitialized.value = true
    }
  }

  async function login(credentials) {
    isLoading.value = true
    try {
      const { data } = await authService.login(credentials)
      token.value = data.access
      refreshToken.value = data.refresh
      user.value = data.user
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login yoki parol xato' }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout({ refresh: refreshToken.value })
    } finally {
      clearAuth()
    }
  }

  async function changePassword(payload) {
    return (await authService.changePassword(payload)).data
  }

  async function changeLogin(payload) {
    const data = (await authService.changeLogin(payload)).data
    user.value = { ...user.value, username: payload.username }
    return data
  }

  function clearAuth() {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user,
    token,
    isInitialized,
    isLoading,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    userRole,
    initializeAuth,
    login,
    logout,
    changePassword,
    changeLogin,
    clearAuth,
  }
})
