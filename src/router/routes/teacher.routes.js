export default [
  {
    path: '/teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      { path: '', redirect: '/teacher/dashboard' },
      {
        path: 'dashboard',
        name: 'teacher-dashboard',
        component: () => import('@/views/teacher/DashboardView.vue'),
      },
      {
        path: 'groups',
        name: 'teacher-groups',
        component: () => import('@/views/teacher/groups/GroupsView.vue'),
      },
      {
        path: 'groups/:id',
        name: 'teacher-group-detail',
        component: () => import('@/views/teacher/groups/GroupDetailView.vue'),
      },
      {
        path: 'assignments',
        name: 'teacher-assignments',
        component: () => import('@/views/teacher/assignments/AssignmentsView.vue'),
      },
      {
        path: 'assignments/:id',
        name: 'teacher-assignment-detail',
        component: () => import('@/views/teacher/assignments/AssignmentDetailView.vue'),
      },
      {
        path: 'resources',
        name: 'teacher-resources',
        component: () => import('@/views/teacher/resources/ResourcesView.vue'),
      },
      {
        path: 'attendance',
        name: 'teacher-attendance',
        component: () => import('@/views/teacher/attendance/AttendanceView.vue'),
      },
      {
        path: 'grades',
        name: 'teacher-grades',
        component: () => import('@/views/teacher/grades/GradesView.vue'),
      },
      {
        path: 'schedule',
        name: 'teacher-schedule',
        component: () => import('@/views/teacher/schedule/ScheduleView.vue'),
      },
    ],
  },
]
