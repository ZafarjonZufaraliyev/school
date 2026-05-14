<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" style="--accent: #6366f1">
        <div class="stat-icon"><ClipboardList :size="22" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Kutilayotgan topshiriqlar</span>
        </div>
      </div>
      <div class="stat-card" style="--accent: #10b981">
        <div class="stat-icon">
          <ProgressRing :percent="attendancePercent" :size="48" :stroke-width="5" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ attendancePercent }}%</span>
          <span class="stat-label">Davomat</span>
        </div>
      </div>
      <div class="stat-card" style="--accent: #f59e0b">
        <div class="stat-icon"><Star :size="22" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ avgGrade || '—' }}</span>
          <span class="stat-label">O'rtacha baho</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <AppCard title="Yaqin topshiriqlar">
        <div class="assign-list">
          <div v-for="a in upcomingAssignments" :key="a.id" class="assign-item">
            <div class="assign-info">
              <p class="assign-title">{{ a.title }}</p>
              <DeadlineTimer :deadline="a.deadline" />
            </div>
            <AppBadge :variant="a.upload_open ? 'success' : 'danger'">
              {{ a.upload_open ? 'Ochiq' : 'Yopiq' }}
            </AppBadge>
          </div>
          <div v-if="!upcomingAssignments.length" class="empty-msg">Topshiriq yo'q</div>
        </div>
      </AppCard>
      <AppCard title="Haftalik natijalar">
        <LineChart :data="weeklyData" :height="220" />
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ClipboardList, Star } from 'lucide-vue-next'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useAuthStore } from '@/stores/auth.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import DeadlineTimer from '@/components/shared/DeadlineTimer.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import LineChart from '@/components/charts/LineChart.vue'

const assignmentsStore = useAssignmentsStore()
const authStore = useAuthStore()

const attendancePercent = ref(82)
const avgGrade = ref(78)

const upcomingAssignments = computed(() =>
  assignmentsStore.assignments.filter((a) => a.upload_open).slice(0, 5),
)
const pendingCount = computed(() => upcomingAssignments.value.length)

const weeklyData = computed(() => ({
  labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
  datasets: [
    {
      label: 'Baholar',
      data: [72, 78, 75, 82],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
    },
  ],
}))

onMounted(() => assignmentsStore.fetchAssignments())
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--accent);
  }
}
.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.stat-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
}
.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.assign-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.assign-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem;
  border-radius: 10px;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
}
.assign-title {
  margin: 0 0 0.2rem;
  font-weight: 600;
  font-size: 0.9rem;
}
.empty-msg {
  text-align: center;
  color: var(--text-muted);
  padding: 1.5rem;
}
</style>
