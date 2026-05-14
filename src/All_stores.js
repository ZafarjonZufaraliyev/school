// ═══════════════════════════════════════════════════════════════
// src/stores/auth.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { apiService } from '@/services/api.service'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isInitialized = ref(false)
  const isLoading = ref(false)

  // ── Getters ────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStudent = computed(() => user.value?.role === 'student')

  // ── Actions ────────────────────────────────────────────────
  async function initializeAuth() {
    if (!token.value) {
      isInitialized.value = true
      return
    }
    try {
      apiService.setToken(token.value)
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
      apiService.setToken(data.access)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login xatosi' }
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
    const { data } = await authService.changePassword(payload)
    return data
  }

  async function changeLogin(payload) {
    const { data } = await authService.changeLogin(payload)
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
    user, token, isInitialized, isLoading,
    isAuthenticated, isAdmin, isTeacher, isStudent,
    initializeAuth, login, logout, changePassword, changeLogin, clearAuth
  }
})


// ═══════════════════════════════════════════════════════════════
// src/stores/groups.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { groupsService } from '@/services/groups.service'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([])
  const currentGroup = ref(null)
  const isLoading = ref(false)
  const pagination = ref({ count: 0, next: null, previous: null })

  const groupsOptions = computed(() =>
    groups.value.map(g => ({ value: g.id, label: g.name }))
  )

  async function fetchGroups(params = {}) {
    isLoading.value = true
    try {
      const { data } = await groupsService.getAll(params)
      groups.value = data.results
      pagination.value = { count: data.count, next: data.next, previous: data.previous }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchGroup(id) {
    isLoading.value = true
    try {
      const { data } = await groupsService.getById(id)
      currentGroup.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  async function createGroup(payload) {
    const { data } = await groupsService.create(payload)
    groups.value.unshift(data)
    return data
  }

  async function updateGroup(id, payload) {
    const { data } = await groupsService.update(id, payload)
    const idx = groups.value.findIndex(g => g.id === id)
    if (idx !== -1) groups.value[idx] = data
    if (currentGroup.value?.id === id) currentGroup.value = data
    return data
  }

  async function deleteGroup(id) {
    await groupsService.delete(id)
    groups.value = groups.value.filter(g => g.id !== id)
  }

  return {
    groups, currentGroup, isLoading, pagination, groupsOptions,
    fetchGroups, fetchGroup, createGroup, updateGroup, deleteGroup
  }
})


// ═══════════════════════════════════════════════════════════════
// src/stores/assignments.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { assignmentsService } from '@/services/assignments.service'

export const useAssignmentsStore = defineStore('assignments', () => {
  const assignments = ref([])
  const currentAssignment = ref(null)
  const submissions = ref([])
  const isLoading = ref(false)

  async function fetchAssignments(params = {}) {
    isLoading.value = true
    try {
      const { data } = await assignmentsService.getAll(params)
      assignments.value = data.results
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAssignment(id) {
    const { data } = await assignmentsService.getById(id)
    currentAssignment.value = data
    return data
  }

  async function createAssignment(payload) {
    const { data } = await assignmentsService.create(payload)
    assignments.value.unshift(data)
    return data
  }

  async function toggleUpload(id, isOpen) {
    const { data } = await assignmentsService.toggleUpload(id, { upload_open: isOpen })
    const idx = assignments.value.findIndex(a => a.id === id)
    if (idx !== -1) assignments.value[idx].upload_open = isOpen
    return data
  }

  async function submitAssignment(id, formData) {
    const { data } = await assignmentsService.submit(id, formData)
    return data
  }

  async function fetchSubmissions(assignmentId) {
    const { data } = await assignmentsService.getSubmissions(assignmentId)
    submissions.value = data
    return data
  }

  async function gradeSubmission(submissionId, payload) {
    const { data } = await assignmentsService.gradeSubmission(submissionId, payload)
    const idx = submissions.value.findIndex(s => s.id === submissionId)
    if (idx !== -1) submissions.value[idx] = { ...submissions.value[idx], ...data }
    return data
  }

  return {
    assignments, currentAssignment, submissions, isLoading,
    fetchAssignments, fetchAssignment, createAssignment,
    toggleUpload, submitAssignment, fetchSubmissions, gradeSubmission
  }
})


// ═══════════════════════════════════════════════════════════════
// src/stores/attendance.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { attendanceService } from '@/services/attendance.service'

export const useAttendanceStore = defineStore('attendance', () => {
  const records = ref([])
  const studentAttendance = ref([])
  const isLoading = ref(false)

  // { studentId: { present: N, absent: N, excused: N, total: N, percentage: N } }
  const attendanceStats = computed(() => {
    const stats = {}
    records.value.forEach(r => {
      if (!stats[r.student_id]) {
        stats[r.student_id] = { present: 0, absent: 0, excused: 0, total: 0, percentage: 0 }
      }
      stats[r.student_id].total++
      if (r.status === 'present') stats[r.student_id].present++
      if (r.status === 'absent') stats[r.student_id].absent++
      if (r.status === 'excused') stats[r.student_id].excused++
    })
    Object.keys(stats).forEach(id => {
      const s = stats[id]
      s.percentage = s.total ? Math.round((s.present / s.total) * 100) : 0
    })
    return stats
  })

  async function fetchAttendance(params = {}) {
    isLoading.value = true
    try {
      const { data } = await attendanceService.getAll(params)
      records.value = data
    } finally {
      isLoading.value = false
    }
  }

  async function saveAttendance(payload) {
    // payload: { group_id, subject_id, date, records: [{ student_id, status }] }
    const { data } = await attendanceService.save(payload)
    await fetchAttendance({ group_id: payload.group_id, subject_id: payload.subject_id })
    return data
  }

  async function fetchStudentAttendance(studentId, params = {}) {
    const { data } = await attendanceService.getStudentAttendance(studentId, params)
    studentAttendance.value = data
    return data
  }

  return {
    records, studentAttendance, isLoading, attendanceStats,
    fetchAttendance, saveAttendance, fetchStudentAttendance
  }
})


// ═══════════════════════════════════════════════════════════════
// src/stores/notifications.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsService } from '@/services/notifications.service'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const isLoading = ref(false)

  const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.is_read))

  async function fetchNotifications() {
    const { data } = await notificationsService.getAll()
    notifications.value = data
  }

  async function markAsRead(id) {
    await notificationsService.markRead(id)
    const n = notifications.value.find(n => n.id === id)
    if (n) n.is_read = true
  }

  async function markAllAsRead() {
    await notificationsService.markAllRead()
    notifications.value.forEach(n => { n.is_read = true })
  }

  function addNotification(notification) {
    notifications.value.unshift(notification)
  }

  return {
    notifications, isLoading, unreadCount, unreadNotifications,
    fetchNotifications, markAsRead, markAllAsRead, addNotification
  }
})


// ═══════════════════════════════════════════════════════════════
// src/stores/theme.store.js
// ═══════════════════════════════════════════════════════════════
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // Apply on init
  applyTheme()

  return { isDark, toggleTheme }
})