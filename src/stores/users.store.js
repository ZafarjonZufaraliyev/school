import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUsersService as usersService } from '@/services/mock.service'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const currentUser = ref(null)
  const isLoading = ref(false)
  const pagination = ref({ count: 0, next: null, previous: null })

  async function fetchUsers(params = {}) {
    isLoading.value = true
    try {
      const { data } = await usersService.getAll(params)
      users.value = data.results ?? data
      if (data.count !== undefined)
        pagination.value = { count: data.count, next: data.next, previous: data.previous }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id) {
    const { data } = await usersService.getById(id)
    currentUser.value = data
    return data
  }

  async function createUser(payload) {
    const { data } = await usersService.create(payload)
    users.value.unshift(data)
    return data
  }

  async function updateUser(id, payload) {
    const { data } = await usersService.update(id, payload)
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value[idx] = data
    if (currentUser.value?.id === id) currentUser.value = data
    return data
  }

  async function deleteUser(id) {
    await usersService.delete(id)
    users.value = users.value.filter((u) => u.id !== id)
  }

  return {
    users,
    currentUser,
    isLoading,
    pagination,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
})
