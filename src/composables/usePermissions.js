import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { can } from '@/utils/permissions'

export function usePermissions() {
  const authStore = useAuthStore()
  const userRole = computed(() => authStore.userRole)

  const hasPermission = (permission) => can(userRole.value, permission)

  return { hasPermission, userRole }
}
