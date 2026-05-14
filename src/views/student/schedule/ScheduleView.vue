<template>
  <div>
    <div class="schedule-grid">
      <div v-for="day in WEEK_DAYS" :key="day" class="day-col">
        <div class="day-header">{{ day }}</div>
        <div class="day-lessons">
          <div v-for="lesson in lessonsForDay(day)" :key="lesson.id" class="lesson-card">
            <span class="lesson-time">{{ lesson.start_time }} – {{ lesson.end_time }}</span>
            <span class="lesson-subject">{{ lesson.subject?.name }}</span>
            <span class="lesson-teacher">{{ lesson.teacher?.full_name }}</span>
            <span class="lesson-room">{{ lesson.room }}</span>
          </div>
          <div v-if="!lessonsForDay(day).length" class="no-lesson">—</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store'
import { useAuthStore } from '@/stores/auth.store'
import { WEEK_DAYS } from '@/utils/constants'

const scheduleStore = useScheduleStore()
const authStore = useAuthStore()

const lessonsForDay = (day) => scheduleStore.schedule.filter((s) => s.day === day)

onMounted(() => {
  const user = authStore.user
  if (user) scheduleStore.fetchSchedule({ student_id: user.id })
})
</script>

<style scoped lang="scss">
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
.lesson-room {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
}
.no-lesson {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding: 0.5rem;
}
</style>
