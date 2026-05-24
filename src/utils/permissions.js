import { ROLES } from './constants'

export const PERMISSIONS = {
  // Users
  CREATE_USER: [ROLES.ADMIN],
  EDIT_USER: [ROLES.ADMIN],
  DELETE_USER: [ROLES.ADMIN],
  VIEW_ALL_USERS: [ROLES.ADMIN],

  // Categories / Classes
  CREATE_CATEGORY: [ROLES.ADMIN],
  CREATE_CLASS: [ROLES.ADMIN],

  // Attendance
  SCAN_QR: [ROLES.ADMIN, ROLES.GUARD],
  MANUAL_ATTENDANCE: [ROLES.ADMIN],
  VIEW_ALL_ATTENDANCE: [ROLES.ADMIN],
  VIEW_LIVE_MONITOR: [ROLES.ADMIN, ROLES.GUARD],

  // Reports
  VIEW_REPORTS: [ROLES.ADMIN],
  EXPORT_REPORTS: [ROLES.ADMIN],

  // Own data
  VIEW_OWN_QR: [ROLES.MEMBER],
  VIEW_OWN_HISTORY: [ROLES.MEMBER],
}

export const can = (userRole, permission) => PERMISSIONS[permission]?.includes(userRole) ?? false
