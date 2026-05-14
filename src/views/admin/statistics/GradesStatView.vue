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
    <AppCard title="O'zlashtirish statistikasi">
      <LineChart :data="chartData" :height="300" />
    </AppCard>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGroupsStore } from '@/stores/groups.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import LineChart from '@/components/charts/LineChart.vue'
const groupsStore = useGroupsStore()
const selectedGroup = ref('')
const chartData = computed(() => ({
  labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
  datasets: [
    {
      label: "O'rtacha baho",
      data: [72, 78, 75, 82],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
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
}
</style>
