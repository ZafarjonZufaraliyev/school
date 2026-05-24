export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'live',
        name: 'admin-live',
        component: () => import('@/views/admin/LiveMonitorView.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/users/UsersView.vue'),
      },
      {
        path: 'users/:id',
        name: 'admin-user-detail',
        component: () => import('@/views/admin/users/UserDetailView.vue'),
      },
      {
        path: 'reports/daily',
        name: 'admin-report-daily',
        component: () => import('@/views/admin/reports/DailyReportView.vue'),
      },
      {
        path: 'reports/summary',
        name: 'admin-report-summary',
        component: () => import('@/views/admin/reports/SummaryReportView.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/SettingsView.vue'),
      },
    ],
  },
]
