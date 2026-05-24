<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in statCards" :key="stat.label" class="stat-card" :style="{ '--accent': stat.color }">
        <div class="stat-icon"><component :is="stat.icon" :size="24" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <AppCard title="Haftalik kelib-ketish">
        <BarChart :data="weeklyChartData" :height="220" />
      </AppCard>
      <AppCard title="Bugun kategoriya bo'yicha">
        <DoughnutChart :data="categoryChartData" :height="220" />
      </AppCard>
    </div>

    <AppCard title="Oxirgi harakatlar">
      <div v-if="logsLoading" class="skeleton-list">
        <AppSkeleton v-for="i in 5" :key="i" height="52px" radius="10px" />
      </div>
      <div v-else class="log-list">
        <div v-for="log in recentLogs" :key="log.id" class="log-item">
          <UserAvatar :name="log.user?.full_name" :size="38" />
          <div class="log-info">
            <p class="log-name">{{ log.user?.full_name }}</p>
            <span class="log-meta">
              {{ log.user?.class?.name }} · {{ log.user?.category?.name }}
            </span>
          </div>
          <div class="log-right">
            <AppBadge :variant="log.type === 'checkin' ? 'success' : 'danger'">
              {{ log.type === 'checkin' ? '→ Kirdi' : '← Chiqdi' }}
            </AppBadge>
            <span class="log-time">{{ formatTime(log.scanned_at) }}</span>
          </div>
        </div>
        <div v-if="!recentLogs.length" class="empty-state">Bugun hech qanday harakat yo'q</div>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, LogIn, LogOut, Clock } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatTime } from '@/utils/formatters'

const attendanceStore = useAttendanceStore()
const logsLoading = ref(true)

const statCards = computed(() => {
  const s = attendanceStore.stats
  return [
    { label: 'Bugun keldi', value: s?.today_checkins ?? 0, icon: LogIn, color: '#10b981' },
    { label: 'Bugun ketdi', value: s?.today_checkouts ?? 0, icon: LogOut, color: '#6366f1' },
    { label: 'Hozir ichida', value: s?.currently_inside ?? 0, icon: Users, color: '#3b82f6' },
    { label: 'Kech keldi', value: s?.late_today ?? 0, icon: Clock, color: '#ef4444' },
  ]
})

const recentLogs = computed(() => attendanceStore.dailyLogs.slice(0, 8))

const weeklyChartData = computed(() => {
  const weekly = attendanceStore.stats?.weekly ?? []
  return {
    labels: weekly.map((w) => w.day),
    datasets: [
      { label: 'Keldi', data: weekly.map((w) => w.checkins), backgroundColor: '#10b981', borderRadius: 6 },
      { label: 'Ketdi', data: weekly.map((w) => w.checkouts), backgroundColor: '#6366f1', borderRadius: 6 },
    ],
  }
})

const categoryChartData = computed(() => ({
  labels: ["O'quvchilar", "O'qituvchilar", 'Xodimlar'],
  datasets: [{
    data: [32, 8, 4],
    backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
    borderWidth: 0,
  }],
}))

onMounted(async () => {
  await Promise.all([attendanceStore.fetchStats(), attendanceStore.fetchDaily()])
  logsLoading.value = false
})
</script>

<style scoped lang="scss">
.dashboard { display: flex; flex-direction: column; gap: 1.5rem; }

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
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: var(--accent);
  }
}
.stat-icon {
  width: 50px; height: 50px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  flex-shrink: 0;
}
.stat-value { display: block; font-size: 1.75rem; font-weight: 800; color: var(--text-primary); }
.stat-label { font-size: 0.82rem; color: var(--text-muted); }

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.log-list { display: flex; flex-direction: column; gap: 0.5rem; }
.skeleton-list { display: flex; flex-direction: column; gap: 0.5rem; }
.log-item {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  transition: background 0.15s;
  &:hover { background: var(--bg-elevated); }
}
.log-info { flex: 1; }
.log-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.15rem; }
.log-meta { font-size: 0.78rem; color: var(--text-muted); }
.log-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; }
.log-time { font-size: 0.75rem; color: var(--text-muted); }
.empty-state { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem; }
</style>
