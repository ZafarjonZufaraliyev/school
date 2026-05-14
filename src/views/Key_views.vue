<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- src/views/teacher/attendance/AttendanceView.vue               -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Davomat</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Kunlik davomat qo'yish</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AppSelect
          v-model="selectedGroup"
          :options="groupOptions"
          placeholder="Guruh tanlang"
          @change="loadStudents"
        />
        <AppSelect
          v-model="selectedSubject"
          :options="subjectOptions"
          placeholder="Fan tanlang"
        />
        <AppDatePicker v-model="selectedDate" />
      </div>
      <div class="mt-3 flex justify-end">
        <AppButton @click="loadStudents" :disabled="!selectedGroup" variant="primary" size="sm">
          Yuklash
        </AppButton>
      </div>
    </div>

    <!-- Attendance Table -->
    <div v-if="students.length" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">
          {{ selectedDate }} — {{ students.length }} ta o'quvchi
        </h2>
        <div class="flex items-center gap-2">
          <button @click="setAll('present')" class="text-xs px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium hover:bg-green-100 transition-colors">
            Hammasi kelgan
          </button>
          <button @click="setAll('absent')" class="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 transition-colors">
            Hammasi kelmagan
          </button>
        </div>
      </div>

      <div class="divide-y divide-gray-50 dark:divide-gray-800">
        <div
          v-for="(student, idx) in students"
          :key="student.id"
          class="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span class="w-8 text-sm text-gray-400">{{ idx + 1 }}</span>
          <UserAvatar :user="student" size="sm" class="mr-3" />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ student.full_name }}</p>
            <p class="text-xs text-gray-400">{{ student.student_id }}</p>
          </div>
          <!-- Status buttons -->
          <div class="flex items-center gap-2">
            <button
              v-for="status in statuses"
              :key="status.value"
              @click="setStatus(student.id, status.value)"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                attendance[student.id] === status.value
                  ? status.activeClass
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Summary bar -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center gap-6 text-sm">
        <span class="text-green-600 dark:text-green-400 font-medium">
          Kelgan: {{ countByStatus('present') }}
        </span>
        <span class="text-red-500 font-medium">
          Kelmagan: {{ countByStatus('absent') }}
        </span>
        <span class="text-orange-500 font-medium">
          Sababli: {{ countByStatus('excused') }}
        </span>
        <div class="ml-auto">
          <AppButton @click="saveAttendance" :loading="isSaving" variant="primary" size="sm">
            Saqlash
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useGroupsStore } from '@/stores/groups.store'
import { useAttendanceStore } from '@/stores/attendance.store'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

const groupsStore = useGroupsStore()
const attendanceStore = useAttendanceStore()
const toast = useToast()

const selectedGroup = ref('')
const selectedSubject = ref('')
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const students = ref([])
const attendance = reactive({})
const isSaving = ref(false)

const statuses = [
  { value: 'present', label: 'Kelgan', activeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  { value: 'absent', label: 'Kelmagan', activeClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  { value: 'excused', label: 'Sababli', activeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
]

const groupOptions = computed(() => groupsStore.groupsOptions)
const subjectOptions = ref([]) // Loaded when group selected

async function loadStudents() {
  const group = await groupsStore.fetchGroup(selectedGroup.value)
  students.value = group.students
  subjectOptions.value = group.subjects.map(s => ({ value: s.id, label: s.name }))
  students.value.forEach(s => { attendance[s.id] = 'present' })
}

function setStatus(studentId, status) { attendance[studentId] = status }
function setAll(status) { students.value.forEach(s => { attendance[s.id] = status }) }
function countByStatus(status) { return Object.values(attendance).filter(v => v === status).length }

async function saveAttendance() {
  isSaving.value = true
  try {
    await attendanceStore.saveAttendance({
      group_id: selectedGroup.value,
      subject_id: selectedSubject.value,
      date: selectedDate.value,
      records: students.value.map(s => ({ student_id: s.id, status: attendance[s.id] }))
    })
    toast.success("Davomat muvaffaqiyatli saqlandi!")
  } catch {
    toast.error("Saqlashda xatolik yuz berdi")
  } finally {
    isSaving.value = false
  }
}
</script>


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- src/views/student/assignments/AssignmentsView.vue             -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vazifalar</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Barcha topshiriqlar va muddatlar</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          activeTab === tab.value
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs px-1.5 py-0.5 rounded-full">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Assignment cards -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
                {{ assignment.subject_name }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="statusClass(assignment)">
                {{ statusLabel(assignment) }}
              </span>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ assignment.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ assignment.description }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <DeadlineTimer :deadline="assignment.deadline" class="justify-end" />
            <p class="text-xs text-gray-400 mt-1">Muddat</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            O'qituvchi: <span class="font-medium text-gray-700 dark:text-gray-300">{{ assignment.teacher_name }}</span>
          </div>

          <!-- Upload section -->
          <div class="flex items-center gap-2">
            <template v-if="assignment.upload_open && !assignment.my_submission">
              <label :for="`file-${assignment.id}`"
                class="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                <UploadIcon class="w-4 h-4" />
                Yuklash
              </label>
              <input
                :id="`file-${assignment.id}`"
                type="file"
                class="hidden"
                accept=".pdf,.doc,.docx"
                @change="handleUpload($event, assignment.id)"
              />
            </template>

            <template v-else-if="assignment.my_submission">
              <a :href="assignment.my_submission.file" target="_blank"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-900 hover:bg-green-100 transition-colors">
                <CheckIcon class="w-4 h-4" />
                Topshirilgan
              </a>
              <span v-if="assignment.my_submission.grade"
                class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold">
                {{ assignment.my_submission.grade }}
              </span>
            </template>

            <span v-else class="text-xs text-red-500 font-medium">Yuklash yopiq</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useToast } from 'vue-toastification'
import { UploadIcon, CheckIcon } from 'lucide-vue-next'
import DeadlineTimer from '@/components/shared/DeadlineTimer.vue'
import dayjs from 'dayjs'

const assignmentsStore = useAssignmentsStore()
const toast = useToast()
const activeTab = ref('active')

const tabs = computed(() => [
  { value: 'active', label: 'Faol', count: activeCount.value },
  { value: 'submitted', label: 'Topshirilgan' },
  { value: 'expired', label: 'Muddati tugagan' },
])

const activeCount = computed(() =>
  assignmentsStore.assignments.filter(a =>
    !a.my_submission && dayjs().isBefore(dayjs(a.deadline))
  ).length
)

const filteredAssignments = computed(() => {
  const all = assignmentsStore.assignments
  if (activeTab.value === 'active')
    return all.filter(a => !a.my_submission && dayjs().isBefore(dayjs(a.deadline)))
  if (activeTab.value === 'submitted')
    return all.filter(a => a.my_submission)
  return all.filter(a => !a.my_submission && dayjs().isAfter(dayjs(a.deadline)))
})

function statusClass(a) {
  if (a.my_submission?.grade) return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  if (a.my_submission) return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  if (dayjs().isAfter(dayjs(a.deadline))) return 'bg-red-50 dark:bg-red-900/20 text-red-500'
  return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
}

function statusLabel(a) {
  if (a.my_submission?.grade) return `Baho: ${a.my_submission.grade}`
  if (a.my_submission) return 'Topshirilgan'
  if (dayjs().isAfter(dayjs(a.deadline))) return 'Muddati tugagan'
  return 'Kutilmoqda'
}

async function handleUpload(event, assignmentId) {
  const file = event.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    await assignmentsStore.submitAssignment(assignmentId, formData)
    toast.success("Vazifa muvaffaqiyatli topshirildi!")
    await assignmentsStore.fetchAssignments()
  } catch {
    toast.error("Yuklashda xatolik!")
  }
}

onMounted(() => assignmentsStore.fetchAssignments())
</script>