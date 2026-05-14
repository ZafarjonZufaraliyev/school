import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockNotificationsService as notificationsService } from '@/services/mock.service'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const isLoading = ref(false)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.is_read).length)
  const unreadNotifications = computed(() => notifications.value.filter((n) => !n.is_read))

  async function fetchNotifications() {
    try {
      const { data } = await notificationsService.getAll()
      notifications.value = data
    } catch {
      /* silent */
    }
  }

  async function markAsRead(id) {
    await notificationsService.markRead(id)
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.is_read = true
  }

  async function markAllAsRead() {
    await notificationsService.markAllRead()
    notifications.value.forEach((n) => {
      n.is_read = true
    })
  }

  function addNotification(notification) {
    notifications.value.unshift(notification)
  }

  return {
    notifications,
    isLoading,
    unreadCount,
    unreadNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  }
})
