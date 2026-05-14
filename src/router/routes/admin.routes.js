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
        path: 'students',
        name: 'admin-students',
        component: () => import('@/views/admin/students/StudentsListView.vue'),
      },
      {
        path: 'students/:id',
        name: 'admin-student-detail',
        component: () => import('@/views/admin/students/StudentDetailView.vue'),
      },
      {
        path: 'teachers',
        name: 'admin-teachers',
        component: () => import('@/views/admin/teachers/TeachersListView.vue'),
      },
      {
        path: 'teachers/:id',
        name: 'admin-teacher-detail',
        component: () => import('@/views/admin/teachers/TeacherDetailView.vue'),
      },
      {
        path: 'groups',
        name: 'admin-groups',
        component: () => import('@/views/admin/groups/GroupsListView.vue'),
      },
      {
        path: 'groups/:id',
        name: 'admin-group-detail',
        component: () => import('@/views/admin/groups/GroupDetailView.vue'),
      },
      {
        path: 'subjects',
        name: 'admin-subjects',
        component: () => import('@/views/admin/subjects/SubjectsView.vue'),
      },
      {
        path: 'schedule',
        name: 'admin-schedule',
        component: () => import('@/views/admin/schedule/ScheduleView.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/users/UsersView.vue'),
      },
      {
        path: 'statistics/attendance',
        name: 'admin-attendance-stat',
        component: () => import('@/views/admin/statistics/AttendanceStatView.vue'),
      },
      {
        path: 'statistics/grades',
        name: 'admin-grades-stat',
        component: () => import('@/views/admin/statistics/GradesStatView.vue'),
      },
      {
        path: 'statistics/weekly',
        name: 'admin-weekly',
        component: () => import('@/views/admin/statistics/WeeklyResultsView.vue'),
      },
      {
        path: 'resources',
        name: 'admin-resources',
        component: () => import('@/views/admin/resources/ResourcesView.vue'),
      },
    ],
  },
]
