export default [
  {
    path: '/member',
    component: () => import('@/layouts/MemberLayout.vue'),
    meta: { requiresAuth: true, role: 'member' },
    children: [
      { path: '', redirect: '/member/qr' },
      {
        path: 'qr',
        name: 'member-qr',
        component: () => import('@/views/member/QrCardView.vue'),
      },
      {
        path: 'history',
        name: 'member-history',
        component: () => import('@/views/member/HistoryView.vue'),
      },
      {
        path: 'profile',
        name: 'member-profile',
        component: () => import('@/views/member/ProfileView.vue'),
      },
    ],
  },
]
