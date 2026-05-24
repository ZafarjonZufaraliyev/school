/**
 * Service exports — USE_MOCK=true bo'lsa mock, false bo'lsa real API ishlatiladi.
 * Backend tayyor bo'lgach: VITE_USE_MOCK=false qilib .env ga yozing.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let authService, usersService, attendanceService, notificationsService
let categoriesService, classesService

if (USE_MOCK) {
  const m = await import('./mock.service.js')
  authService = m.mockAuthService
  usersService = m.mockUsersService
  attendanceService = m.mockAttendanceService
  notificationsService = m.mockNotificationsService
  categoriesService = m.mockCategoriesService
  classesService = m.mockClassesService
} else {
  authService = (await import('./auth.service.js')).authService
  usersService = (await import('./users.service.js')).usersService
  attendanceService = (await import('./attendance.service.js')).attendanceService
  notificationsService = (await import('./notifications.service.js')).notificationsService
  categoriesService = (await import('./categories.service.js')).categoriesService
  classesService = (await import('./classes.service.js')).classesService
}

export { authService, usersService, attendanceService, notificationsService, categoriesService, classesService }
