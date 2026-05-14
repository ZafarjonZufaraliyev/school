export default [
  {
    path: '/student',
    component: () => import('@/layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: '', redirect: '/student/dashboard' },
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: () => import('@/views/student/DashboardView.vue'),
      },
      {
        path: 'assignments',
        name: 'student-assignments',
        component: () => import('@/views/student/assignments/AssignmentsView.vue'),
      },
      {
        path: 'resources',
        name: 'student-resources',
        component: () => import('@/views/student/resources/ResourcesView.vue'),
      },
      {
        path: 'grades',
        name: 'student-grades',
        component: () => import('@/views/student/grades/GradesView.vue'),
      },
      {
        path: 'attendance',
        name: 'student-attendance',
        component: () => import('@/views/student/attendance/AttendanceView.vue'),
      },
      {
        path: 'schedule',
        name: 'student-schedule',
        component: () => import('@/views/student/schedule/ScheduleView.vue'),
      },
      {
        path: 'profile',
        name: 'student-profile',
        component: () => import('@/views/student/profile/ProfileView.vue'),
      },
    ],
  },
]
