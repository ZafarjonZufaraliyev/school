import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAttendanceService as attendanceService } from '@/services/mock.service'

export const useAttendanceStore = defineStore('attendance', () => {
  const records = ref([])
  const studentAttendance = ref([])
  const isLoading = ref(false)

  const attendanceStats = computed(() => {
    const stats = {}
    records.value.forEach((r) => {
      if (!stats[r.student_id])
        stats[r.student_id] = { present: 0, absent: 0, excused: 0, total: 0, percentage: 0 }
      stats[r.student_id].total++
      if (r.status === 'present') stats[r.student_id].present++
      if (r.status === 'absent') stats[r.student_id].absent++
      if (r.status === 'excused') stats[r.student_id].excused++
    })
    Object.keys(stats).forEach((id) => {
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
    const { data } = await attendanceService.save(payload)
    return data
  }

  async function fetchStudentAttendance(studentId, params = {}) {
    isLoading.value = true
    try {
      const { data } = await attendanceService.getStudentAttendance(studentId, params)
      studentAttendance.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  return {
    records,
    studentAttendance,
    isLoading,
    attendanceStats,
    fetchAttendance,
    saveAttendance,
    fetchStudentAttendance,
  }
})
