import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockGradesService as gradesService } from '@/services/mock.service'

export const useGradesStore = defineStore('grades', () => {
  const grades = ref([])
  const studentGrades = ref([])
  const weeklyResults = ref([])
  const isLoading = ref(false)

  async function fetchGrades(params = {}) {
    isLoading.value = true
    try {
      const { data } = await gradesService.getAll(params)
      grades.value = data.results ?? data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStudentGrades(studentId) {
    isLoading.value = true
    try {
      const { data } = await gradesService.getStudentGrades(studentId)
      studentGrades.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWeeklyResults(params = {}) {
    const { data } = await gradesService.getWeeklyResults(params)
    weeklyResults.value = data
    return data
  }

  async function bulkSaveGrades(payload) {
    return (await gradesService.bulkSave(payload)).data
  }

  return {
    grades,
    studentGrades,
    weeklyResults,
    isLoading,
    fetchGrades,
    fetchStudentGrades,
    fetchWeeklyResults,
    bulkSaveGrades,
  }
})
