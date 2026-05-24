/**
 * Mock Service — Kelib-Ketish Nazorat Tizimi
 * Backend tayyor bo'lguncha ishlatiladi.
 */

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

// ── Mock Kategoriyalar ────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 1, name: "O'quvchi", slug: 'student', color: '#6366f1' },
  { id: 2, name: "O'qituvchi", slug: 'teacher', color: '#10b981' },
  { id: 3, name: 'Xodim', slug: 'staff', color: '#f59e0b' },
]

// ── Mock Sinflar ──────────────────────────────────────────────
export const MOCK_CLASSES = [
  { id: 1, name: '9-A sinf', category_id: 1 },
  { id: 2, name: '9-B sinf', category_id: 1 },
  { id: 3, name: '10-A sinf', category_id: 1 },
  { id: 4, name: "O'qituvchilar", category_id: 2 },
  { id: 5, name: 'Texnik xodimlar', category_id: 3 },
]

// ── Mock Foydalanuvchilar ─────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    full_name: 'Abdullayev Sardor',
    phone: '+998 90 111 11 11',
    category: null,
    class: null,
    photo: null,
    qr_checkin: 'QR_IN_1_abc111',
    qr_checkout: 'QR_OUT_1_abc111',
  },
  {
    id: 2,
    username: 'guard',
    password: 'guard123',
    role: 'guard',
    full_name: 'Nazarov Ulmas',
    phone: '+998 90 222 22 22',
    category: null,
    class: null,
    photo: null,
    qr_checkin: 'QR_IN_2_abc222',
    qr_checkout: 'QR_OUT_2_abc222',
  },
  {
    id: 3,
    username: 'aliyev',
    password: 'pass123',
    role: 'member',
    full_name: 'Aliyev Jasur',
    phone: '+998 90 100 01 01',
    parent_phone: '+998 90 900 01 01',
    category: MOCK_CATEGORIES[0],
    class: { id: 1, name: '9-A sinf' },
    photo: null,
    qr_checkin: 'QR_IN_3_abc333',
    qr_checkout: 'QR_OUT_3_abc333',
  },
  {
    id: 4,
    username: 'nazarova',
    password: 'pass123',
    role: 'member',
    full_name: 'Nazarova Dilnoza',
    phone: '+998 90 100 02 02',
    parent_phone: '+998 90 900 02 02',
    category: MOCK_CATEGORIES[0],
    class: { id: 1, name: '9-A sinf' },
    photo: null,
    qr_checkin: 'QR_IN_4_abc444',
    qr_checkout: 'QR_OUT_4_abc444',
  },
  {
    id: 5,
    username: 'karimov',
    password: 'pass123',
    role: 'member',
    full_name: 'Karimov Bobur',
    phone: '+998 90 200 01 01',
    category: MOCK_CATEGORIES[1],
    class: { id: 4, name: "O'qituvchilar" },
    photo: null,
    qr_checkin: 'QR_IN_5_abc555',
    qr_checkout: 'QR_OUT_5_abc555',
  },
  {
    id: 6,
    username: 'mirzayeva',
    password: 'pass123',
    role: 'member',
    full_name: 'Mirzayeva Gulnora',
    phone: '+998 90 200 02 02',
    category: MOCK_CATEGORIES[1],
    class: { id: 4, name: "O'qituvchilar" },
    photo: null,
    qr_checkin: 'QR_IN_6_abc666',
    qr_checkout: 'QR_OUT_6_abc666',
  },
  {
    id: 7,
    username: 'toshmatov',
    password: 'pass123',
    role: 'member',
    full_name: 'Toshmatov Sherzod',
    phone: '+998 90 100 03 03',
    parent_phone: '+998 90 900 03 03',
    category: MOCK_CATEGORIES[0],
    class: { id: 2, name: '9-B sinf' },
    photo: null,
    qr_checkin: 'QR_IN_7_abc777',
    qr_checkout: 'QR_OUT_7_abc777',
  },
  {
    id: 8,
    username: 'xoliqov',
    password: 'pass123',
    role: 'member',
    full_name: 'Xoliqov Mansur',
    phone: '+998 90 300 01 01',
    category: MOCK_CATEGORIES[2],
    class: { id: 5, name: 'Texnik xodimlar' },
    photo: null,
    qr_checkin: 'QR_IN_8_abc888',
    qr_checkout: 'QR_OUT_8_abc888',
  },
]

// ── Mock Davomat Loglari ──────────────────────────────────────
const now = new Date()
const today = now.toISOString().split('T')[0]

let MOCK_LOGS = [
  {
    id: 1,
    user_id: 3,
    user: { id: 3, full_name: 'Aliyev Jasur', category: MOCK_CATEGORIES[0], class: { name: '9-A sinf' } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 7200000).toISOString(),
    is_late: false,
  },
  {
    id: 2,
    user_id: 4,
    user: { id: 4, full_name: 'Nazarova Dilnoza', category: MOCK_CATEGORIES[0], class: { name: '9-A sinf' } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 6900000).toISOString(),
    is_late: true,
  },
  {
    id: 3,
    user_id: 5,
    user: { id: 5, full_name: 'Karimov Bobur', category: MOCK_CATEGORIES[1], class: { name: "O'qituvchilar" } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 7500000).toISOString(),
    is_late: false,
  },
  {
    id: 4,
    user_id: 3,
    user: { id: 3, full_name: 'Aliyev Jasur', category: MOCK_CATEGORIES[0], class: { name: '9-A sinf' } },
    type: 'checkout',
    scanned_at: new Date(now.getTime() - 3600000).toISOString(),
    is_late: false,
  },
  {
    id: 5,
    user_id: 7,
    user: { id: 7, full_name: 'Toshmatov Sherzod', category: MOCK_CATEGORIES[0], class: { name: '9-B sinf' } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 6600000).toISOString(),
    is_late: false,
  },
  {
    id: 6,
    user_id: 8,
    user: { id: 8, full_name: 'Xoliqov Mansur', category: MOCK_CATEGORIES[2], class: { name: 'Texnik xodimlar' } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 7800000).toISOString(),
    is_late: false,
  },
  {
    id: 7,
    user_id: 6,
    user: { id: 6, full_name: 'Mirzayeva Gulnora', category: MOCK_CATEGORIES[1], class: { name: "O'qituvchilar" } },
    type: 'checkin',
    scanned_at: new Date(now.getTime() - 6000000).toISOString(),
    is_late: true,
  },
]

let nextLogId = 10

// ── Mock Auth Service ─────────────────────────────────────────
export const mockAuthService = {
  async login(credentials) {
    await delay(400)
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )
    if (!user) throw { response: { data: { message: 'Login yoki parol xato' } } }
    const { password: _, ...safeUser } = user
    return {
      data: {
        token: 'mock-token-' + user.role + '-' + user.id,
        user: safeUser,
      },
    }
  },
  async logout() {
    await delay(100)
    return { data: {} }
  },
  async getProfile() {
    await delay(200)
    const token = localStorage.getItem('access_token') || ''
    const parts = token.replace('mock-token-', '').split('-')
    const userId = parseInt(parts[1])
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user) throw { response: { status: 401 } }
    const { password: _, ...safeUser } = user
    return { data: safeUser }
  },
  async changePassword() {
    await delay(200)
    return { data: { message: "Parol o'zgartirildi" } }
  },
}

// ── Mock Users Service ────────────────────────────────────────
export const mockUsersService = {
  async getAll(params = {}) {
    await delay(200)
    let users = MOCK_USERS.map(({ password: _, ...u }) => u)
    if (params.role) users = users.filter((u) => u.role === params.role)
    if (params.category_slug)
      users = users.filter((u) => u.category?.slug === params.category_slug)
    if (params.class_id) users = users.filter((u) => u.class?.id == params.class_id)
    return { data: { data: users, total: users.length } }
  },
  async getById(id) {
    await delay(150)
    const user = MOCK_USERS.find((u) => u.id == id)
    if (!user) throw { response: { status: 404 } }
    const { password: _, ...safe } = user
    return { data: safe }
  },
  async create(payload) {
    await delay(300)
    const newUser = {
      id: Date.now(),
      ...payload,
      qr_checkin: `QR_IN_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      qr_checkout: `QR_OUT_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    }
    MOCK_USERS.push(newUser)
    const { password: _, ...safe } = newUser
    return { data: safe }
  },
  async update(id, payload) {
    await delay(300)
    return { data: { id, ...payload } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
  async getQr(id) {
    await delay(150)
    const user = MOCK_USERS.find((u) => u.id == id)
    if (!user) throw { response: { status: 404 } }
    return { data: { qr_checkin: user.qr_checkin, qr_checkout: user.qr_checkout } }
  },
  async regenerateQr(id) {
    await delay(300)
    const qr_checkin = `QR_IN_${id}_${Math.random().toString(36).slice(2, 8)}`
    const qr_checkout = `QR_OUT_${id}_${Math.random().toString(36).slice(2, 8)}`
    const user = MOCK_USERS.find((u) => u.id == id)
    if (user) { user.qr_checkin = qr_checkin; user.qr_checkout = qr_checkout }
    return { data: { qr_checkin, qr_checkout } }
  },
}

// ── Mock Categories Service ───────────────────────────────────
export const mockCategoriesService = {
  async getAll() {
    await delay(150)
    return { data: MOCK_CATEGORIES }
  },
  async create(p) {
    await delay(300)
    return { data: { id: Date.now(), ...p } }
  },
  async update(id, p) {
    await delay(300)
    return { data: { id, ...p } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
}

// ── Mock Classes Service ──────────────────────────────────────
export const mockClassesService = {
  async getAll(params = {}) {
    await delay(150)
    let classes = [...MOCK_CLASSES]
    if (params.category_id) classes = classes.filter((c) => c.category_id == params.category_id)
    return { data: classes }
  },
  async create(p) {
    await delay(300)
    return { data: { id: Date.now(), ...p } }
  },
  async update(id, p) {
    await delay(300)
    return { data: { id, ...p } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
}

// ── Mock Attendance Service ───────────────────────────────────
export const mockAttendanceService = {
  async scan(qrCode) {
    await delay(500)
    const isCheckin = qrCode.startsWith('QR_IN_')
    const isCheckout = qrCode.startsWith('QR_OUT_')
    if (!isCheckin && !isCheckout) {
      throw { response: { data: { message: 'QR kod noto\'g\'ri' } } }
    }

    const user = MOCK_USERS.find(
      (u) => u.qr_checkin === qrCode || u.qr_checkout === qrCode,
    )
    if (!user) throw { response: { data: { message: 'Foydalanuvchi topilmadi' } } }

    const type = isCheckin ? 'checkin' : 'checkout'
    const { password: _, ...safeUser } = user
    const log = {
      id: nextLogId++,
      user_id: user.id,
      user: { id: user.id, full_name: user.full_name, category: user.category, class: user.class },
      type,
      scanned_at: new Date().toISOString(),
      is_late: false,
    }
    MOCK_LOGS.push(log)
    return { data: { log, user: safeUser } }
  },

  async manualCheckin(userId) {
    await delay(300)
    const user = MOCK_USERS.find((u) => u.id == userId)
    if (!user) throw { response: { status: 404 } }
    const log = {
      id: nextLogId++,
      user_id: user.id,
      user: { id: user.id, full_name: user.full_name, category: user.category, class: user.class },
      type: 'checkin',
      scanned_at: new Date().toISOString(),
      is_late: false,
    }
    MOCK_LOGS.push(log)
    return { data: log }
  },

  async manualCheckout(userId) {
    await delay(300)
    const user = MOCK_USERS.find((u) => u.id == userId)
    if (!user) throw { response: { status: 404 } }
    const log = {
      id: nextLogId++,
      user_id: user.id,
      user: { id: user.id, full_name: user.full_name, category: user.category, class: user.class },
      type: 'checkout',
      scanned_at: new Date().toISOString(),
      is_late: false,
    }
    MOCK_LOGS.push(log)
    return { data: log }
  },

  async getLive() {
    await delay(200)
    // Hozir binoda bo'lganlar: oxirgi logli checkin, checkout yo'q
    const lastByUser = {}
    MOCK_LOGS.forEach((log) => {
      if (!lastByUser[log.user_id] || log.scanned_at > lastByUser[log.user_id].scanned_at) {
        lastByUser[log.user_id] = log
      }
    })
    const inside = Object.values(lastByUser).filter((l) => l.type === 'checkin')
    return { data: inside }
  },

  async getDaily(date) {
    await delay(200)
    const d = date || today
    const logs = MOCK_LOGS.filter((l) => l.scanned_at.startsWith(d))
    return { data: logs }
  },

  async getByUser(userId, params = {}) {
    await delay(200)
    let logs = MOCK_LOGS.filter((l) => l.user_id == userId)
    if (params.date) logs = logs.filter((l) => l.scanned_at.startsWith(params.date))
    return { data: logs }
  },

  async getSummary(params = {}) {
    await delay(200)
    const checkins = MOCK_LOGS.filter((l) => l.type === 'checkin').length
    const checkouts = MOCK_LOGS.filter((l) => l.type === 'checkout').length
    const lates = MOCK_LOGS.filter((l) => l.is_late).length
    return { data: { checkins, checkouts, lates, total_users: MOCK_USERS.length - 2 } }
  },

  async getStats() {
    await delay(200)
    return {
      data: {
        today_checkins: MOCK_LOGS.filter((l) => l.type === 'checkin' && l.scanned_at.startsWith(today)).length,
        today_checkouts: MOCK_LOGS.filter((l) => l.type === 'checkout' && l.scanned_at.startsWith(today)).length,
        currently_inside: 4,
        late_today: MOCK_LOGS.filter((l) => l.is_late && l.scanned_at.startsWith(today)).length,
        weekly: [
          { day: 'Du', checkins: 42, checkouts: 38 },
          { day: 'Se', checkins: 45, checkouts: 41 },
          { day: 'Ch', checkins: 40, checkouts: 37 },
          { day: 'Pa', checkins: 44, checkouts: 40 },
          { day: 'Ju', checkins: 38, checkouts: 35 },
        ],
      },
    }
  },
}

// ── Mock Notifications Service ────────────────────────────────
export const mockNotificationsService = {
  async getAll() {
    await delay(200)
    return {
      data: [
        { id: 1, message: 'Aliyev Jasur kech keldi', is_read: false, created_at: new Date(Date.now() - 600000).toISOString() },
        { id: 2, message: 'Toshmatov Sherzod chiqib ketdi', is_read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
      ],
    }
  },
  async markRead(id) {
    await delay(100)
    return { data: {} }
  },
  async markAllRead() {
    await delay(100)
    return { data: {} }
  },
}
