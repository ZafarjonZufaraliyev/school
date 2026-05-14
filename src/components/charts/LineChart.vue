<template>
  <Line :data="data" :options="options" :style="{ height: height + 'px' }" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const props = defineProps({
  data: { type: Object, required: true },
  height: { type: Number, default: 200 },
})

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(100,116,139,0.1)' }, beginAtZero: true },
  },
  elements: { line: { tension: 0.4 } },
}))
</script>
