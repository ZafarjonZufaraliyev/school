<template>
  <div class="attendance-page">
    <!-- Summary -->
    <div class="summary-row">
      <div class="att-summary-card">
        <ProgressRing :percent="percentage" :size="100" label="Davomat" color="#6366f1" />
        <div class="att-stats">
          <div class="att-stat">
            <span class="att-num success">{{ presentCount }}</span>
            <span class="att-lbl">Keldi</span>
          </div>
          <div class="att-stat">
            <span class="att-num danger">{{ absentCount }}</span>
            <span class="att-lbl">Kelmadi</span>
          </div>
          <div class="att-stat">
            <span class="att-num warning">{{ excusedCount }}</span>
            <span class="att-lbl">Sababli</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance history -->
    <AppCard title="Davomat tarixi">
      <AppTable :columns="columns" :rows="store.studentAttendance" :loading="store.isLoading">
        <template #cell-status="{ row }">
          <AttendanceBadge :status="row.status" />
        </template>
        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-subject="{ row }">
          {{ row.subject?.name || '—' }}
        </template>
      </AppTable>
    </AppCard>

    <!-- Monthly chart -->
    <AppCard title="Oylik davomat">
      <BarChart :data="chartData" :height="240" />
    </AppCard>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { useAuthStore } from '@/stores/auth.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import BarChart from '@/components/charts/BarChart.vue'
import AttendanceBadge from '@/components/shared/AttendanceBadge.vue'
import { formatDate } from '@/utils/formatters'

const store = useAttendanceStore()
const authStore = useAuthStore()

const columns = [
  { key: 'date', label: 'Sana' },
  { key: 'subject', label: 'Fan' },
  { key: 'status', label: 'Holat' },
]

const presentCount = computed(
  () => store.studentAttendance.filter((r) => r.status === 'present').length,
)
const absentCount = computed(
  () => store.studentAttendance.filter((r) => r.status === 'absent').length,
)
const excusedCount = computed(
  () => store.studentAttendance.filter((r) => r.status === 'excused').length,
)
const total = computed(() => store.studentAttendance.length)
const percentage = computed(() =>
  total.value ? Math.round((presentCount.value / total.value) * 100) : 0,
)

const chartData = computed(() => ({
  labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
  datasets: [
    { label: 'Keldi', data: [5, 4, 5, 5], backgroundColor: '#10b981', borderRadius: 6 },
    { label: 'Kelmadi', data: [1, 2, 0, 1], backgroundColor: '#ef4444', borderRadius: 6 },
    { label: 'Sababli', data: [0, 0, 1, 0], backgroundColor: '#f59e0b', borderRadius: 6 },
  ],
}))

onMounted(() => {
  const id = authStore.user?.id
  if (id) store.fetchStudentAttendance(id)
})
</script>

<style scoped lang="scss">
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.summary-row {
  display: flex;
}
.att-summary-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}
.att-stats {
  display: flex;
  gap: 2rem;
}
.att-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.att-num {
  font-size: 1.75rem;
  font-weight: 800;
  &.success {
    color: var(--success);
  }
  &.danger {
    color: var(--danger);
  }
  &.warning {
    color: var(--warning);
  }
}
.att-lbl {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
