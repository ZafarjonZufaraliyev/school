<template>
  <div class="stat-page">
    <AppCard title="Haftalik natijalar">
      <BarChart :data="chartData" :height="300" />
    </AppCard>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
const chartData = computed(() => ({
  labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta', '5-hafta'],
  datasets: [
    { label: 'Davomat %', data: [88, 85, 90, 87, 92], backgroundColor: '#6366f1', borderRadius: 6 },
    {
      label: "O'rtacha baho",
      data: [74, 78, 76, 82, 80],
      backgroundColor: '#10b981',
      borderRadius: 6,
    },
  ],
}))
</script>
<style scoped lang="scss">
.stat-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
