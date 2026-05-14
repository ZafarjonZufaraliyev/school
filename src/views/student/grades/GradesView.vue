<template>
  <div class="grades-page">
    <!-- Summary cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <ProgressRing :percent="avgPercent" :size="90" label="O'rtacha" color="#6366f1" />
        <div class="summary-info">
          <span class="summary-value">{{ avgGrade }}</span>
          <span class="summary-label">O'rtacha baho</span>
        </div>
      </div>
      <div class="summary-card">
        <ProgressRing :percent="topPercent" :size="90" label="Eng yuqori" color="#10b981" />
        <div class="summary-info">
          <span class="summary-value">{{ topGrade }}</span>
          <span class="summary-label">Eng yuqori baho</span>
        </div>
      </div>
    </div>

    <!-- Grades table -->
    <AppCard title="Baholar tarixi">
      <AppTable :columns="columns" :rows="store.studentGrades" :loading="store.isLoading">
        <template #cell-grade="{ value }">
          <span class="grade-pill" :class="gradeClass(value)">{{ value }}</span>
        </template>
        <template #cell-subject="{ row }">
          {{ row.subject?.name || '—' }}
        </template>
        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>
      </AppTable>
    </AppCard>

    <!-- Weekly chart -->
    <AppCard title="Haftalik natijalar">
      <LineChart :data="weeklyData" :height="240" />
    </AppCard>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGradesStore } from '@/stores/grades.store'
import { useAuthStore } from '@/stores/auth.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { formatDate } from '@/utils/formatters'

const store = useGradesStore()
const authStore = useAuthStore()

const columns = [
  { key: 'subject', label: 'Fan' },
  { key: 'grade', label: 'Baho' },
  { key: 'date', label: 'Sana' },
  { key: 'comment', label: 'Izoh' },
]

const avgGrade = computed(() => {
  const g = store.studentGrades
  if (!g.length) return 0
  return Math.round(g.reduce((s, r) => s + r.grade, 0) / g.length)
})
const topGrade = computed(() =>
  store.studentGrades.length ? Math.max(...store.studentGrades.map((r) => r.grade)) : 0,
)
const avgPercent = computed(() => avgGrade.value)
const topPercent = computed(() => topGrade.value)

const gradeClass = (v) => {
  if (v >= 90) return 'grade-a'
  if (v >= 75) return 'grade-b'
  if (v >= 60) return 'grade-c'
  return 'grade-d'
}

const weeklyData = computed(() => ({
  labels: store.weeklyResults.map((w) => w.week_label || `${w.week}-hafta`),
  datasets: [
    {
      label: 'Baho',
      data: store.weeklyResults.map((w) => w.avg_grade),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
    },
  ],
}))

onMounted(async () => {
  const id = authStore.user?.id
  if (id) {
    await store.fetchStudentGrades(id)
    await store.fetchWeeklyResults({ student_id: id })
  }
})
</script>

<style scoped lang="scss">
.grades-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.summary-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
}
.summary-info {
  display: flex;
  flex-direction: column;
}
.summary-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}
.summary-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.grade-pill {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 700;
  &.grade-a {
    background: var(--success-light);
    color: var(--success);
  }
  &.grade-b {
    background: var(--primary-light);
    color: var(--primary);
  }
  &.grade-c {
    background: var(--warning-light);
    color: var(--warning);
  }
  &.grade-d {
    background: var(--danger-light);
    color: var(--danger);
  }
}
</style>
