/**
 * Service exports — USE_MOCK=true bo'lsa mock, false bo'lsa real API ishlatiladi.
 * Backend tayyor bo'lgach: VITE_USE_MOCK=false qilib .env ga yozing.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let authService, usersService, groupsService, subjectsService
let assignmentsService, attendanceService, resourcesService
let gradesService, scheduleService, notificationsService

if (USE_MOCK) {
  const m = await import('./mock.service.js')
  authService = m.mockAuthService
  usersService = m.mockUsersService
  groupsService = m.mockGroupsService
  subjectsService = m.mockSubjectsService
  assignmentsService = m.mockAssignmentsService
  attendanceService = m.mockAttendanceService
  resourcesService = m.mockResourcesService
  gradesService = m.mockGradesService
  scheduleService = m.mockScheduleService
  notificationsService = m.mockNotificationsService
} else {
  authService = (await import('./auth.service.js')).authService
  usersService = (await import('./users.service.js')).usersService
  groupsService = (await import('./groups.service.js')).groupsService
  subjectsService = (await import('./subjects.service.js')).subjectsService
  assignmentsService = (await import('./assignments.service.js')).assignmentsService
  attendanceService = (await import('./attendance.service.js')).attendanceService
  resourcesService = (await import('./resources.service.js')).resourcesService
  gradesService = (await import('./grades.service.js')).gradesService
  scheduleService = (await import('./schedule.service.js')).scheduleService
  notificationsService = (await import('./notifications.service.js')).notificationsService
}

export {
  authService,
  usersService,
  groupsService,
  subjectsService,
  assignmentsService,
  attendanceService,
  resourcesService,
  gradesService,
  scheduleService,
  notificationsService,
}
