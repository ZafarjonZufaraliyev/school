import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockResourcesService as resourcesService } from '@/services/mock.service'

export const useResourcesStore = defineStore('resources', () => {
  const resources = ref([])
  const isLoading = ref(false)

  async function fetchResources(params = {}) {
    isLoading.value = true
    try {
      const { data } = await resourcesService.getAll(params)
      resources.value = data.results ?? data
    } finally {
      isLoading.value = false
    }
  }

  async function createResource(formData) {
    const { data } = await resourcesService.create(formData)
    resources.value.unshift(data)
    return data
  }

  async function deleteResource(id) {
    await resourcesService.delete(id)
    resources.value = resources.value.filter((r) => r.id !== id)
  }

  return { resources, isLoading, fetchResources, createResource, deleteResource }
})
