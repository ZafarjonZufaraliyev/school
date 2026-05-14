import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockScheduleService as scheduleService } from '@/services/mock.service'

export const useScheduleStore = defineStore('schedule', () => {
  const schedule = ref([])
  const isLoading = ref(false)

  async function fetchSchedule(params = {}) {
    isLoading.value = true
    try {
      const { data } = await scheduleService.getAll(params)
      schedule.value = data.results ?? data
    } finally {
      isLoading.value = false
    }
  }

  async function createSchedule(payload) {
    const { data } = await scheduleService.create(payload)
    schedule.value.push(data)
    return data
  }

  async function updateSchedule(id, payload) {
    const { data } = await scheduleService.update(id, payload)
    const idx = schedule.value.findIndex((s) => s.id === id)
    if (idx !== -1) schedule.value[idx] = data
    return data
  }

  async function deleteSchedule(id) {
    await scheduleService.delete(id)
    schedule.value = schedule.value.filter((s) => s.id !== id)
  }

  return { schedule, isLoading, fetchSchedule, createSchedule, updateSchedule, deleteSchedule }
})
