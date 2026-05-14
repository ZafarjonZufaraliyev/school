<template>
  <div class="attendance-page">
    <div class="filters">
      <AppSelect
        v-model="selectedGroup"
        :options="groupsStore.groupsOptions"
        placeholder="Guruh"
        style="min-width: 180px"
      />
      <AppSelect
        v-model="selectedSubject"
        :options="subjectsStore.subjectsOptions"
        placeholder="Fan"
        style="min-width: 180px"
      />
      <AppInput v-model="selectedDate" type="date" label="" />
      <AppButton @click="loadStudents" :loading="loading">Yuklash</AppButton>
    </div>

    <AppCard v-if="students.length" title="Davomat belgilash">
      <div class="attendance-list">
        <div v-for="s in students" :key="s.id" class="attendance-row">
          <UserAvatar :name="s.full_name" :size="36" />
          <span class="student-name">{{ s.full_name }}</span>
          <div class="status-btns">
            <button
              v-for="status in statuses"
              :key="status.value"
              class="status-btn"
              :class="[status.cls, { active: records[s.id] === status.value }]"
              @click="records[s.id] = status.value"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="save-row">
        <AppButton :loading="saving" @click="saveAttendance">Saqlash</AppButton>
      </div>
    </AppCard>

    <div v-else-if="!loading" class="empty-hint">
      <p>Guruh va fanni tanlab, "Yuklash" tugmasini bosing</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGroupsStore } from '@/stores/groups.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useAttendanceStore } from '@/stores/attendance.store'
import { useToast } from 'vue-toastification'
import { mockGroupsService } from '@/services/mock.service'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const attendanceStore = useAttendanceStore()
const toast = useToast()

const selectedGroup = ref('')
const selectedSubject = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const students = ref([])
const records = reactive({})
const loading = ref(false)
const saving = ref(false)

const statuses = [
  { value: 'present', label: 'Keldi', cls: 'present' },
  { value: 'absent', label: 'Kelmadi', cls: 'absent' },
  { value: 'excused', label: 'Sababli', cls: 'excused' },
]

async function loadStudents() {
  if (!selectedGroup.value) return toast.warning('Guruh tanlang')
  loading.value = true
  try {
    const { data } = await mockGroupsService.getStudents(selectedGroup.value)
    students.value = data
    data.forEach((s) => {
      records[s.id] = 'present'
    })
  } finally {
    loading.value = false
  }
}

async function saveAttendance() {
  saving.value = true
  try {
    await attendanceStore.saveAttendance({
      group_id: selectedGroup.value,
      subject_id: selectedSubject.value,
      date: selectedDate.value,
      records: Object.entries(records).map(([student_id, status]) => ({ student_id, status })),
    })
    toast.success('Davomat saqlandi')
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  groupsStore.fetchGroups()
  subjectsStore.fetchSubjects()
})
</script>

<style scoped lang="scss">
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.filters {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}
.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.attendance-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
}
.student-name {
  flex: 1;
  font-weight: 500;
  font-size: 0.9rem;
}
.status-btns {
  display: flex;
  gap: 0.4rem;
}
.status-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &.present.active {
    background: var(--success);
    color: #fff;
    border-color: var(--success);
  }
  &.absent.active {
    background: var(--danger);
    color: #fff;
    border-color: var(--danger);
  }
  &.excused.active {
    background: var(--warning);
    color: #fff;
    border-color: var(--warning);
  }
}
.save-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.empty-hint {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}
</style>
