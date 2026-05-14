<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" style="--accent: #6366f1">
        <div class="stat-icon"><BookOpen :size="22" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ groupsStore.groups.length }}</span>
          <span class="stat-label">Guruhlarim</span>
        </div>
      </div>
      <div class="stat-card" style="--accent: #10b981">
        <div class="stat-icon"><ClipboardList :size="22" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ assignmentsStore.assignments.length }}</span>
          <span class="stat-label">Topshiriqlar</span>
        </div>
      </div>
      <div class="stat-card" style="--accent: #f59e0b">
        <div class="stat-icon"><FolderOpen :size="22" /></div>
        <div class="stat-info">
          <span class="stat-value">{{ resourcesStore.resources.length }}</span>
          <span class="stat-label">Resurslar</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <AppCard title="Guruhlar davomati">
        <BarChart :data="attendanceData" :height="220" />
      </AppCard>
      <AppCard title="Guruhlarim">
        <div class="groups-list">
          <div
            v-for="g in groupsStore.groups"
            :key="g.id"
            class="group-item"
            @click="router.push(`/teacher/groups/${g.id}`)"
          >
            <div class="g-icon">{{ g.name[0] }}</div>
            <div>
              <p class="g-name">{{ g.name }}</p>
              <p class="g-count">{{ g.students_count || 0 }} o'quvchi</p>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen, ClipboardList, FolderOpen } from 'lucide-vue-next'
import { useGroupsStore } from '@/stores/groups.store'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useResourcesStore } from '@/stores/resources.store'
import AppCard from '@/components/ui/AppCard.vue'
import BarChart from '@/components/charts/BarChart.vue'

const router = useRouter()
const groupsStore = useGroupsStore()
const assignmentsStore = useAssignmentsStore()
const resourcesStore = useResourcesStore()

const attendanceData = computed(() => ({
  labels: groupsStore.groups.map((g) => g.name),
  datasets: [
    {
      label: 'Davomat %',
      data: groupsStore.groups.map(() => Math.floor(Math.random() * 20 + 75)),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    },
  ],
}))

onMounted(() => {
  groupsStore.fetchGroups()
  assignmentsStore.fetchAssignments()
  resourcesStore.fetchResources()
})
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
  width: 48px;
  height: 48px;
  border-radius: 12px;
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
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.group-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
}
.g-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.g-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
}
.g-count {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
