<template>
  <div>
    <div class="page-toolbar">
      <AppSelect
        v-model="selectedGroup"
        :options="groupsStore.groupsOptions"
        placeholder="Guruh tanlang"
        style="min-width: 200px"
      />
      <AppButton @click="showModal = true"><Plus :size="16" /> Qo'shish</AppButton>
    </div>
    <div class="schedule-grid">
      <div v-for="day in WEEK_DAYS" :key="day" class="day-col">
        <div class="day-header">{{ day }}</div>
        <div class="day-lessons">
          <div v-for="lesson in lessonsForDay(day)" :key="lesson.id" class="lesson-card">
            <span class="lesson-time">{{ lesson.start_time }} – {{ lesson.end_time }}</span>
            <span class="lesson-subject">{{ lesson.subject?.name }}</span>
            <span class="lesson-teacher">{{ lesson.teacher?.full_name }}</span>
          </div>
          <div v-if="!lessonsForDay(day).length" class="no-lesson">—</div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" title="Dars qo'shish">
      <form class="form-grid">
        <AppSelect v-model="form.group_id" label="Guruh" :options="groupsStore.groupsOptions" />
        <AppSelect v-model="form.subject_id" label="Fan" :options="subjectsStore.subjectsOptions" />
        <AppSelect v-model="form.day" label="Kun" :options="dayOptions" />
        <AppInput v-model="form.start_time" label="Boshlanish" type="time" />
        <AppInput v-model="form.end_time" label="Tugash" type="time" />
        <AppInput v-model="form.room" label="Xona" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="save">Saqlash</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useScheduleStore } from '@/stores/schedule.store'
import { useGroupsStore } from '@/stores/groups.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useToast } from 'vue-toastification'
import { WEEK_DAYS } from '@/utils/constants'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'

const scheduleStore = useScheduleStore()
const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const toast = useToast()

const selectedGroup = ref('')
const showModal = ref(false)
const saving = ref(false)
const form = reactive({
  group_id: '',
  subject_id: '',
  day: '',
  start_time: '',
  end_time: '',
  room: '',
})

const dayOptions = WEEK_DAYS.map((d) => ({ value: d, label: d }))

const lessonsForDay = (day) =>
  scheduleStore.schedule.filter(
    (s) => s.day === day && (!selectedGroup.value || s.group_id == selectedGroup.value),
  )

async function save() {
  saving.value = true
  try {
    await scheduleStore.createSchedule(form)
    toast.success("Dars qo'shildi")
    showModal.value = false
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  scheduleStore.fetchSchedule()
  groupsStore.fetchGroups()
  subjectsStore.fetchSubjects()
})
</script>

<style scoped lang="scss">
.page-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
}
.day-col {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}
.day-header {
  background: var(--bg-elevated);
  padding: 0.6rem 0.75rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: center;
}
.day-lessons {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.lesson-card {
  background: var(--primary-light);
  border-radius: 8px;
  padding: 0.5rem 0.6rem;
}
.lesson-time {
  display: block;
  font-size: 0.72rem;
  color: var(--primary);
  font-weight: 600;
}
.lesson-subject {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
}
.lesson-teacher {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.no-lesson {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding: 0.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
