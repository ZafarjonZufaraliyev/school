import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockSubjectsService as subjectsService } from '@/services/mock.service'

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref([])
  const isLoading = ref(false)

  const subjectsOptions = computed(() =>
    subjects.value.map((s) => ({ value: s.id, label: s.name })),
  )

  async function fetchSubjects(params = {}) {
    isLoading.value = true
    try {
      const { data } = await subjectsService.getAll(params)
      subjects.value = data.results ?? data
    } finally {
      isLoading.value = false
    }
  }

  async function createSubject(payload) {
    const { data } = await subjectsService.create(payload)
    subjects.value.unshift(data)
    return data
  }

  async function updateSubject(id, payload) {
    const { data } = await subjectsService.update(id, payload)
    const idx = subjects.value.findIndex((s) => s.id === id)
    if (idx !== -1) subjects.value[idx] = data
    return data
  }

  async function deleteSubject(id) {
    await subjectsService.delete(id)
    subjects.value = subjects.value.filter((s) => s.id !== id)
  }

  return {
    subjects,
    isLoading,
    subjectsOptions,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  }
})
