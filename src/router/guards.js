import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    // Initialize auth once
    if (!authStore.isInitialized) {
      await authStore.initializeAuth()
    }

    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
    const requiredRole = to.matched.find((r) => r.meta.role)?.meta.role

    // Not authenticated → go to login
    if (requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Wrong role → redirect to own dashboard
    if (requiredRole && authStore.userRole !== requiredRole) {
      const role = authStore.userRole
      if (role === 'admin') return '/admin/dashboard'
      if (role === 'guard') return '/guard/scanner'
      if (role === 'member') return '/member/qr'
      return '/login'
    }

    // Already logged in → redirect from login
    if (to.name === 'login' && authStore.isAuthenticated) {
      const role = authStore.userRole
      if (role === 'admin') return '/admin/dashboard'
      if (role === 'guard') return '/guard/scanner'
      return '/member/qr'
    }

    // Allow navigation
    return true
  })
}
