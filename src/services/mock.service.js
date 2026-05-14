/**
 * Mock Service — backend tayyor bo'lguncha ishlatiladi.
 * Haqiqiy backend ulanganda bu faylni o'chirib, api.service.js ga o'ting.
 */

// ── Mock foydalanuvchilar ──────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    full_name: 'Abdullayev Admin',
    phone: '+998 90 111 11 11',
    email: 'admin@eduuz.uz',
  },
  {
    id: 2,
    username: 'teacher',
    password: 'teacher123',
    role: 'teacher',
    full_name: 'Karimov Bobur',
    phone: '+998 90 222 22 22',
    email: 'teacher@eduuz.uz',
  },
  {
    id: 3,
    username: 'student',
    password: 'student123',
    role: 'student',
    full_name: 'Yusupova Malika',
    phone: '+998 90 333 33 33',
    email: 'student@eduuz.uz',
    group: { id: 1, name: 'G-101' },
  },
]

// ── Mock Groups ───────────────────────────────────────────────
export const MOCK_GROUPS = [
  { id: 1, name: 'G-101', students_count: 18, subjects_count: 4 },
  { id: 2, name: 'G-102', students_count: 22, subjects_count: 5 },
  { id: 3, name: 'G-103', students_count: 15, subjects_count: 4 },
  { id: 4, name: 'G-201', students_count: 20, subjects_count: 6 },
  { id: 5, name: 'G-202', students_count: 17, subjects_count: 5 },
]

// ── Mock Subjects ─────────────────────────────────────────────
export const MOCK_SUBJECTS = [
  { id: 1, name: 'Matematika' },
  { id: 2, name: 'Fizika' },
  { id: 3, name: 'Ingliz tili' },
  { id: 4, name: 'Informatika' },
  { id: 5, name: 'Kimyo' },
  { id: 6, name: 'Biologiya' },
]

// ── Mock Students ─────────────────────────────────────────────
export const MOCK_STUDENTS = [
  {
    id: 10,
    username: 'student1',
    full_name: 'Aliyev Jasur',
    role: 'student',
    phone: '+998 90 100 01 01',
    group: { id: 1, name: 'G-101' },
  },
  {
    id: 11,
    username: 'student2',
    full_name: 'Nazarova Dilnoza',
    role: 'student',
    phone: '+998 90 100 02 02',
    group: { id: 1, name: 'G-101' },
  },
  {
    id: 12,
    username: 'student3',
    full_name: 'Toshmatov Sherzod',
    role: 'student',
    phone: '+998 90 100 03 03',
    group: { id: 2, name: 'G-102' },
  },
  {
    id: 13,
    username: 'student4',
    full_name: 'Xoliqova Feruza',
    role: 'student',
    phone: '+998 90 100 04 04',
    group: { id: 2, name: 'G-102' },
  },
  {
    id: 14,
    username: 'student5',
    full_name: 'Rahimov Otabek',
    role: 'student',
    phone: '+998 90 100 05 05',
    group: { id: 3, name: 'G-103' },
  },
]

// ── Mock Teachers ─────────────────────────────────────────────
export const MOCK_TEACHERS = [
  {
    id: 20,
    username: 'teacher1',
    full_name: 'Karimov Bobur',
    role: 'teacher',
    phone: '+998 90 200 01 01',
  },
  {
    id: 21,
    username: 'teacher2',
    full_name: 'Mirzayeva Gulnora',
    role: 'teacher',
    phone: '+998 90 200 02 02',
  },
  {
    id: 22,
    username: 'teacher3',
    full_name: 'Umarov Sanjar',
    role: 'teacher',
    phone: '+998 90 200 03 03',
  },
]

// ── Mock Assignments ──────────────────────────────────────────
export const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Kvadrat tenglamalar',
    description: 'Berilgan masalalarni yeching',
    group_id: 1,
    subject: { id: 1, name: 'Matematika' },
    deadline: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    upload_open: true,
    submissions_count: 12,
  },
  {
    id: 2,
    title: 'Nyuton qonunlari',
    description: 'Fizika laboratoriya ishi',
    group_id: 1,
    subject: { id: 2, name: 'Fizika' },
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    upload_open: true,
    submissions_count: 8,
  },
  {
    id: 3,
    title: 'Essay: My Future',
    description: 'Write 200 words essay',
    group_id: 2,
    subject: { id: 3, name: 'Ingliz tili' },
    deadline: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    upload_open: false,
    submissions_count: 20,
  },
  {
    id: 4,
    title: 'Python dasturlash',
    description: 'Calculator dasturi yozing',
    group_id: 1,
    subject: { id: 4, name: 'Informatika' },
    deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    upload_open: true,
    submissions_count: 5,
  },
]

// ── Mock Resources ────────────────────────────────────────────
export const MOCK_RESOURCES = [
  {
    id: 1,
    title: 'Algebra darslik',
    type: 'pdf',
    subject: { name: 'Matematika' },
    file_name: 'algebra.pdf',
  },
  {
    id: 2,
    title: 'Fizika video',
    type: 'video',
    subject: { name: 'Fizika' },
    url: 'https://youtube.com',
  },
  {
    id: 3,
    title: 'Grammar guide',
    type: 'word',
    subject: { name: 'Ingliz tili' },
    file_name: 'grammar.docx',
  },
  {
    id: 4,
    title: 'Python tutorial',
    type: 'link',
    subject: { name: 'Informatika' },
    url: 'https://python.org',
  },
]

// ── Mock Schedule ─────────────────────────────────────────────
export const MOCK_SCHEDULE = [
  {
    id: 1,
    day: 'Dushanba',
    start_time: '09:00',
    end_time: '10:30',
    subject: { name: 'Matematika' },
    teacher: { full_name: 'Karimov Bobur' },
    room: '101',
    group_id: 1,
  },
  {
    id: 2,
    day: 'Dushanba',
    start_time: '11:00',
    end_time: '12:30',
    subject: { name: 'Fizika' },
    teacher: { full_name: 'Mirzayeva Gulnora' },
    room: '202',
    group_id: 1,
  },
  {
    id: 3,
    day: 'Seshanba',
    start_time: '09:00',
    end_time: '10:30',
    subject: { name: 'Ingliz tili' },
    teacher: { full_name: 'Umarov Sanjar' },
    room: '305',
    group_id: 1,
  },
  {
    id: 4,
    day: 'Chorshanba',
    start_time: '10:00',
    end_time: '11:30',
    subject: { name: 'Informatika' },
    teacher: { full_name: 'Karimov Bobur' },
    room: 'Lab',
    group_id: 1,
  },
  {
    id: 5,
    day: 'Payshanba',
    start_time: '09:00',
    end_time: '10:30',
    subject: { name: 'Kimyo' },
    teacher: { full_name: 'Mirzayeva Gulnora' },
    room: '104',
    group_id: 2,
  },
  {
    id: 6,
    day: 'Juma',
    start_time: '14:00',
    end_time: '15:30',
    subject: { name: 'Biologiya' },
    teacher: { full_name: 'Umarov Sanjar' },
    room: '201',
    group_id: 2,
  },
]

// ── Mock Attendance ───────────────────────────────────────────
export const MOCK_ATTENDANCE = [
  { id: 1, student_id: 10, subject: { name: 'Matematika' }, date: '2026-05-01', status: 'present' },
  { id: 2, student_id: 10, subject: { name: 'Fizika' }, date: '2026-05-02', status: 'absent' },
  {
    id: 3,
    student_id: 10,
    subject: { name: 'Ingliz tili' },
    date: '2026-05-05',
    status: 'present',
  },
  {
    id: 4,
    student_id: 10,
    subject: { name: 'Informatika' },
    date: '2026-05-06',
    status: 'excused',
  },
  { id: 5, student_id: 10, subject: { name: 'Matematika' }, date: '2026-05-08', status: 'present' },
  { id: 6, student_id: 10, subject: { name: 'Fizika' }, date: '2026-05-09', status: 'present' },
  {
    id: 7,
    student_id: 10,
    subject: { name: 'Ingliz tili' },
    date: '2026-05-12',
    status: 'present',
  },
  { id: 8, student_id: 10, subject: { name: 'Informatika' }, date: '2026-05-13', status: 'absent' },
]

// ── Mock Grades ───────────────────────────────────────────────
export const MOCK_GRADES = [
  {
    id: 1,
    student_id: 10,
    subject: { name: 'Matematika' },
    grade: 88,
    date: '2026-05-03',
    comment: 'Yaxshi',
  },
  {
    id: 2,
    student_id: 10,
    subject: { name: 'Fizika' },
    grade: 75,
    date: '2026-05-04',
    comment: '',
  },
  {
    id: 3,
    student_id: 10,
    subject: { name: 'Ingliz tili' },
    grade: 92,
    date: '2026-05-07',
    comment: "A'lo",
  },
  {
    id: 4,
    student_id: 10,
    subject: { name: 'Informatika' },
    grade: 95,
    date: '2026-05-10',
    comment: 'Mukammal',
  },
  { id: 5, student_id: 10, subject: { name: 'Kimyo' }, grade: 68, date: '2026-05-11', comment: '' },
]

// ── Mock Notifications ────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    message: "Matematika topshirig'i uchun deadline yaqinlashmoqda",
    is_read: false,
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 2,
    message: 'Fizika darsiga davomat belgilandi',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    message: 'Yangi resurs yuklandi: Algebra darslik',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

// ── Helper: simulate async delay ─────────────────────────────
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

// ── Mock Auth Service ─────────────────────────────────────────
export const mockAuthService = {
  async login(credentials) {
    await delay(400)
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )
    if (!user) throw { response: { data: { detail: 'Login yoki parol xato' } } }
    const { password: _, ...safeUser } = user
    return {
      data: {
        access: 'mock-access-token-' + user.role,
        refresh: 'mock-refresh-token-' + user.role,
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
    const role = token.replace('mock-access-token-', '')
    const user = MOCK_USERS.find((u) => u.role === role)
    if (!user) throw { response: { status: 401 } }
    const { password: _, ...safeUser } = user
    return { data: safeUser }
  },
  async changePassword() {
    await delay(200)
    return { data: { detail: "Parol o'zgartirildi" } }
  },
  async changeLogin(payload) {
    await delay(200)
    return { data: { username: payload.username } }
  },
}

// ── Mock Users Service ────────────────────────────────────────
export const mockUsersService = {
  async getAll(params = {}) {
    await delay(200)
    let users = [
      ...MOCK_STUDENTS,
      ...MOCK_TEACHERS,
      ...MOCK_USERS.filter((u) => u.role === 'admin'),
    ]
    if (params.role) users = users.filter((u) => u.role === params.role)
    return { data: { results: users, count: users.length } }
  },
  async getById(id) {
    await delay(150)
    const all = [...MOCK_STUDENTS, ...MOCK_TEACHERS, ...MOCK_USERS]
    return { data: all.find((u) => u.id == id) || null }
  },
  async create(payload) {
    await delay(300)
    return { data: { id: Date.now(), ...payload } }
  },
  async update(id, payload) {
    await delay(300)
    return { data: { id, ...payload } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
}

// ── Mock Groups Service ───────────────────────────────────────
export const mockGroupsService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_GROUPS, count: MOCK_GROUPS.length } }
  },
  async getById(id) {
    await delay(150)
    return { data: MOCK_GROUPS.find((g) => g.id == id) }
  },
  async create(p) {
    await delay(300)
    return { data: { id: Date.now(), ...p, students_count: 0 } }
  },
  async update(id, p) {
    await delay(300)
    return { data: { ...MOCK_GROUPS.find((g) => g.id == id), ...p } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
  async getStudents() {
    await delay(200)
    return { data: MOCK_STUDENTS }
  },
  async getSubjects() {
    await delay(200)
    return { data: MOCK_SUBJECTS }
  },
  async getSchedule() {
    await delay(200)
    return { data: MOCK_SCHEDULE }
  },
  async getStats() {
    await delay(200)
    return { data: { attendance: 85, avg_grade: 78 } }
  },
}

// ── Mock Subjects Service ─────────────────────────────────────
export const mockSubjectsService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_SUBJECTS, count: MOCK_SUBJECTS.length } }
  },
  async getById(id) {
    await delay(150)
    return { data: MOCK_SUBJECTS.find((s) => s.id == id) }
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

// ── Mock Assignments Service ──────────────────────────────────
export const mockAssignmentsService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_ASSIGNMENTS, count: MOCK_ASSIGNMENTS.length } }
  },
  async getById(id) {
    await delay(150)
    return { data: MOCK_ASSIGNMENTS.find((a) => a.id == id) }
  },
  async create(p) {
    await delay(300)
    return { data: { id: Date.now(), ...p, upload_open: true, submissions_count: 0 } }
  },
  async update(id, p) {
    await delay(300)
    return { data: { id, ...p } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
  async toggleUpload(id, p) {
    await delay(200)
    const a = MOCK_ASSIGNMENTS.find((a) => a.id == id)
    if (a) a.upload_open = p.upload_open
    return { data: { upload_open: p.upload_open } }
  },
  async submit() {
    await delay(400)
    return { data: { id: Date.now(), submitted_at: new Date().toISOString() } }
  },
  async getSubmissions() {
    await delay(200)
    return {
      data: MOCK_STUDENTS.slice(0, 3).map((s, i) => ({
        id: i + 1,
        student_name: s.full_name,
        file_url: '#',
        file_name: 'homework.pdf',
        submitted_at: new Date(Date.now() - i * 3600000).toISOString(),
        grade: i === 0 ? 90 : null,
      })),
    }
  },
  async gradeSubmission(id, p) {
    await delay(200)
    return { data: { id, ...p } }
  },
}

// ── Mock Attendance Service ───────────────────────────────────
export const mockAttendanceService = {
  async getAll() {
    await delay(200)
    return { data: MOCK_ATTENDANCE }
  },
  async save(p) {
    await delay(300)
    return { data: p }
  },
  async getStudentAttendance() {
    await delay(200)
    return { data: MOCK_ATTENDANCE }
  },
  async getGroupStats() {
    await delay(200)
    return {
      data: MOCK_STUDENTS.map((s) => ({
        student_id: s.id,
        full_name: s.full_name,
        present: 8,
        absent: 2,
        excused: 1,
        total: 11,
        percentage: 73,
      })),
    }
  },
}

// ── Mock Resources Service ────────────────────────────────────
export const mockResourcesService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_RESOURCES, count: MOCK_RESOURCES.length } }
  },
  async getById(id) {
    await delay(150)
    return { data: MOCK_RESOURCES.find((r) => r.id == id) }
  },
  async create(fd) {
    await delay(400)
    return {
      data: {
        id: Date.now(),
        title: fd.get?.('title') || 'Yangi resurs',
        type: fd.get?.('type') || 'file',
      },
    }
  },
  async update(id, fd) {
    await delay(300)
    return { data: { id } }
  },
  async delete() {
    await delay(200)
    return { data: {} }
  },
  async download() {
    await delay(200)
    return { data: new Blob(['mock file content']) }
  },
}

// ── Mock Grades Service ───────────────────────────────────────
export const mockGradesService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_GRADES, count: MOCK_GRADES.length } }
  },
  async create(p) {
    await delay(300)
    return { data: { id: Date.now(), ...p } }
  },
  async update(id, p) {
    await delay(300)
    return { data: { id, ...p } }
  },
  async bulkSave(p) {
    await delay(400)
    return { data: p }
  },
  async getStudentGrades() {
    await delay(200)
    return { data: MOCK_GRADES }
  },
  async getGroupGrades() {
    await delay(200)
    return { data: MOCK_GRADES }
  },
  async getWeeklyResults() {
    await delay(200)
    return {
      data: [
        { week: 1, week_label: '1-hafta', avg_grade: 72 },
        { week: 2, week_label: '2-hafta', avg_grade: 78 },
        { week: 3, week_label: '3-hafta', avg_grade: 75 },
        { week: 4, week_label: '4-hafta', avg_grade: 82 },
      ],
    }
  },
}

// ── Mock Schedule Service ─────────────────────────────────────
export const mockScheduleService = {
  async getAll() {
    await delay(200)
    return { data: { results: MOCK_SCHEDULE, count: MOCK_SCHEDULE.length } }
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

// ── Mock Notifications Service ────────────────────────────────
export const mockNotificationsService = {
  async getAll() {
    await delay(200)
    return { data: MOCK_NOTIFICATIONS }
  },
  async markRead(id) {
    await delay(100)
    const n = MOCK_NOTIFICATIONS.find((n) => n.id == id)
    if (n) n.is_read = true
    return { data: {} }
  },
  async markAllRead() {
    await delay(100)
    MOCK_NOTIFICATIONS.forEach((n) => {
      n.is_read = true
    })
    return { data: {} }
  },
  async delete() {
    await delay(100)
    return { data: {} }
  },
}
