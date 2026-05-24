import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'
import { apiService } from '@/services/api.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || null)
  const isInitialized = ref(false)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isGuard = computed(() => user.value?.role === 'guard')
  const isMember = computed(() => user.value?.role === 'member')
  const userRole = computed(() => user.value?.role || null)

  async function initializeAuth() {
    if (!token.value) {
      isInitialized.value = true
      return
    }
    apiService.setToken(token.value)
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
      token.value = data.token
      user.value = data.user
      localStorage.setItem('access_token', data.token)
      apiService.setToken(data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login yoki parol xato' }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
    }
  }

  async function changePassword(payload) {
    return (await authService.changePassword(payload)).data
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
    apiService.clearToken()
  }

  return {
    user,
    token,
    isInitialized,
    isLoading,
    isAuthenticated,
    isAdmin,
    isGuard,
    isMember,
    userRole,
    initializeAuth,
    login,
    logout,
    changePassword,
    clearAuth,
  }
})
