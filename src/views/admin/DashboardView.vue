<template>
  <div class="dashboard">
    <!-- Stats cards -->
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
        :style="{ '--accent': stat.color }"
      >
        <div class="stat-icon">
          <component :is="stat.icon" :size="24" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <TrendingUp v-if="stat.trend > 0" :size="14" />
          <TrendingDown v-else :size="14" />
          {{ Math.abs(stat.trend) }}%
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row">
      <AppCard title="Davomat (so'nggi 7 kun)">
        <BarChart :data="attendanceChartData" :height="220" />
      </AppCard>
      <AppCard title="O'zlashtirish taqsimoti">
        <DoughnutChart :data="gradesChartData" :height="220" />
      </AppCard>
    </div>

    <!-- Recent activity -->
    <AppCard title="So'nggi faoliyat">
      <div class="activity-list">
        <div v-for="item in recentActivity" :key="item.id" class="activity-item">
          <UserAvatar :name="item.name" :size="36" />
          <div class="activity-info">
            <p class="activity-text">{{ item.text }}</p>
            <span class="activity-time">{{ fromNow(item.time) }}</span>
          </div>
          <AppBadge :variant="item.variant">{{ item.badge }}</AppBadge>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart2,
} from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import { fromNow } from '@/utils/formatters'

const stats = [
  { label: "O'quvchilar", value: 248, icon: GraduationCap, color: '#6366f1', trend: 12 },
  { label: "O'qituvchilar", value: 18, icon: Users, color: '#10b981', trend: 5 },
  { label: 'Guruhlar', value: 14, icon: BookOpen, color: '#f59e0b', trend: 3 },
  { label: 'Faol fanlar', value: 32, icon: BarChart2, color: '#3b82f6', trend: -2 },
]

const attendanceChartData = computed(() => ({
  labels: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
  datasets: [
    {
      label: 'Keldi',
      data: [210, 198, 220, 215, 205, 180],
      backgroundColor: '#6366f1',
      borderRadius: 6,
    },
    {
      label: 'Kelmadi',
      data: [38, 50, 28, 33, 43, 68],
      backgroundColor: '#ef4444',
      borderRadius: 6,
    },
  ],
}))

const gradesChartData = computed(() => ({
  labels: ['A (90-100)', 'B (75-89)', 'C (60-74)', 'D (<60)'],
  datasets: [
    {
      data: [42, 98, 76, 32],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    },
  ],
}))

const recentActivity = [
  {
    id: 1,
    name: 'Alisher Karimov',
    text: "Matematika topshirig'ini yukladi",
    time: new Date(Date.now() - 300000).toISOString(),
    badge: 'Topshiriq',
    variant: 'primary',
  },
  {
    id: 2,
    name: 'Malika Yusupova',
    text: 'Fizika darsiga kelmadi',
    time: new Date(Date.now() - 900000).toISOString(),
    badge: 'Davomat',
    variant: 'danger',
  },
  {
    id: 3,
    name: 'Bobur Toshmatov',
    text: 'Yangi resurs yukladi',
    time: new Date(Date.now() - 1800000).toISOString(),
    badge: 'Resurs',
    variant: 'success',
  },
]
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
.stat-info {
  flex: 1;
}
.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
}
.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  font-weight: 600;
  &.up {
    color: var(--success);
  }
  &.down {
    color: var(--danger);
  }
}
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem;
  border-radius: 10px;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
}
.activity-info {
  flex: 1;
}
.activity-text {
  font-size: 0.9rem;
  color: var(--text-primary);
  margin: 0 0 0.2rem;
}
.activity-time {
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
