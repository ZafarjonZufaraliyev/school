import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersService } from '@/services'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const currentUser = ref(null)
  const isLoading = ref(false)
  const total = ref(0)

  async function fetchUsers(params = {}) {
    isLoading.value = true
    try {
      const { data } = await usersService.getAll(params)
      users.value = data.data ?? data
      total.value = data.total ?? users.value.length
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
    total.value++
    return data
  }

  async function updateUser(id, payload) {
    const { data } = await usersService.update(id, payload)
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], ...data }
    if (currentUser.value?.id === id) currentUser.value = { ...currentUser.value, ...data }
    return data
  }

  async function deleteUser(id) {
    await usersService.delete(id)
    users.value = users.value.filter((u) => u.id !== id)
    total.value--
  }

  async function getUserQr(id) {
    const { data } = await usersService.getQr(id)
    return data
  }

  async function regenerateQr(id) {
    const { data } = await usersService.regenerateQr(id)
    return data
  }

  return {
    users,
    currentUser,
    isLoading,
    total,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    getUserQr,
    regenerateQr,
  }
})
