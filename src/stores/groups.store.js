import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockGroupsService as groupsService } from '@/services/mock.service'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([])
  const currentGroup = ref(null)
  const isLoading = ref(false)
  const pagination = ref({ count: 0, next: null, previous: null })

  const groupsOptions = computed(() => groups.value.map((g) => ({ value: g.id, label: g.name })))

  async function fetchGroups(params = {}) {
    isLoading.value = true
    try {
      const { data } = await groupsService.getAll(params)
      groups.value = data.results ?? data
      if (data.count !== undefined)
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
    const idx = groups.value.findIndex((g) => g.id === id)
    if (idx !== -1) groups.value[idx] = data
    if (currentGroup.value?.id === id) currentGroup.value = data
    return data
  }

  async function deleteGroup(id) {
    await groupsService.delete(id)
    groups.value = groups.value.filter((g) => g.id !== id)
  }

  return {
    groups,
    currentGroup,
    isLoading,
    pagination,
    groupsOptions,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
  }
})
