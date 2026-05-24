import { defineStore } from 'pinia'
import { ref } from 'vue'
import { attendanceService } from '@/services'

export const useAttendanceStore = defineStore('attendance', () => {
  const liveList = ref([])
  const dailyLogs = ref([])
  const stats = ref(null)
  const isLoading = ref(false)
  const scanResult = ref(null)

  async function scan(qrCode) {
    const { data } = await attendanceService.scan(qrCode)
    scanResult.value = data
    if (data.log?.type === 'checkin') {
      liveList.value.unshift(data.log)
    } else if (data.log?.type === 'checkout') {
      liveList.value = liveList.value.filter((l) => l.user_id !== data.log.user_id)
    }
    return data
  }

  async function manualCheckin(userId) {
    const { data } = await attendanceService.manualCheckin(userId)
    liveList.value.unshift(data)
    return data
  }

  async function manualCheckout(userId) {
    const { data } = await attendanceService.manualCheckout(userId)
    liveList.value = liveList.value.filter((l) => l.user_id !== userId)
    return data
  }

  async function fetchLive() {
    isLoading.value = true
    try {
      const { data } = await attendanceService.getLive()
      liveList.value = data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDaily(date) {
    isLoading.value = true
    try {
      const { data } = await attendanceService.getDaily(date)
      dailyLogs.value = data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStats() {
    const { data } = await attendanceService.getStats()
    stats.value = data
    return data
  }

  async function fetchByUser(userId, params = {}) {
    const { data } = await attendanceService.getByUser(userId, params)
    return data
  }

  return {
    liveList,
    dailyLogs,
    stats,
    isLoading,
    scanResult,
    scan,
    manualCheckin,
    manualCheckout,
    fetchLive,
    fetchDaily,
    fetchStats,
    fetchByUser,
  }
})
