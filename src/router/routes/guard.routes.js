export default [
  {
    path: '/guard',
    component: () => import('@/layouts/GuardLayout.vue'),
    meta: { requiresAuth: true, role: 'guard' },
    children: [
      { path: '', redirect: '/guard/scanner' },
      {
        path: 'scanner',
        name: 'guard-scanner',
        component: () => import('@/views/guard/ScannerView.vue'),
      },
      {
        path: 'live',
        name: 'guard-live',
        component: () => import('@/views/guard/LiveView.vue'),
      },
    ],
  },
]
