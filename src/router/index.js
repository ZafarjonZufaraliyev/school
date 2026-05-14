import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'
import adminRoutes from './routes/admin.routes'
import teacherRoutes from './routes/teacher.routes'
import studentRoutes from './routes/student.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { layout: 'auth' },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
      ],
    },
    ...adminRoutes,
    ...teacherRoutes,
    ...studentRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

setupGuards(router)

export default router
