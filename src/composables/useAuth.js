import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  async function login(credentials) {
    const result = await authStore.login(credentials)
    if (result.success) {
      const role = authStore.userRole
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'teacher') router.push('/teacher/dashboard')
      else router.push('/student/dashboard')
    } else {
      toast.error(result.message)
    }
    return result
  }

  async function logout() {
    await authStore.logout()
    router.push('/login')
  }

  return { login, logout, authStore }
}
