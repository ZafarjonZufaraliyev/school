<template>
  <div class="stat-page">
    <div class="filters">
      <AppSelect
        v-model="selectedGroup"
        :options="groupsStore.groupsOptions"
        placeholder="Guruh"
        style="min-width: 180px"
      />
    </div>
    <AppCard title="Davomat statistikasi">
      <BarChart :data="chartData" :height="300" />
    </AppCard>
    <AppCard title="O'quvchilar davomati">
      <AppTable :columns="columns" :rows="rows" :loading="loading">
        <template #cell-percentage="{ value }">
          <ProgressRing :percent="value" :size="52" />
        </template>
        <template #cell-status="{ row }">
          <AttendanceBadge :status="row.status" />
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGroupsStore } from '@/stores/groups.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import BarChart from '@/components/charts/BarChart.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'
import AttendanceBadge from '@/components/shared/AttendanceBadge.vue'

const groupsStore = useGroupsStore()
const selectedGroup = ref('')
const loading = ref(false)
const rows = ref([])

const columns = [
  { key: 'full_name', label: "O'quvchi" },
  { key: 'present', label: 'Keldi' },
  { key: 'absent', label: 'Kelmadi' },
  { key: 'excused', label: 'Sababli' },
  { key: 'percentage', label: 'Foiz' },
]

const chartData = computed(() => ({
  labels: rows.value.map((r) => r.full_name?.split(' ')[0] || ''),
  datasets: [
    {
      label: 'Davomat %',
      data: rows.value.map((r) => r.percentage),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    },
  ],
}))

onMounted(() => groupsStore.fetchGroups())
</script>

<style scoped lang="scss">
.stat-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
