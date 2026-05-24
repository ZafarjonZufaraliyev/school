<template>
  <div class="summary-page">
    <div class="toolbar">
      <h1 class="page-title">Umumiy Hisobot</h1>
      <div class="date-range">
        <input type="date" v-model="fromDate" class="date-input" @change="load" />
        <span>—</span>
        <input type="date" v-model="toDate" class="date-input" @change="load" />
      </div>
    </div>

    <div class="stats-row" v-if="summary">
      <div class="s-card" style="--c:#10b981"><LogIn :size="18" /> Jami kirish: <strong>{{ summary.checkins }}</strong></div>
      <div class="s-card" style="--c:#6366f1"><LogOut :size="18" /> Jami chiqish: <strong>{{ summary.checkouts }}</strong></div>
      <div class="s-card" style="--c:#f59e0b"><Clock :size="18" /> Kech keldi: <strong>{{ summary.lates }}</strong></div>
      <div class="s-card" style="--c:#3b82f6"><Users :size="18" /> Jami a'zolar: <strong>{{ summary.total_users }}</strong></div>
    </div>

    <AppCard title="Kunlik grafik">
      <BarChart v-if="chartData" :data="chartData" :height="260" />
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LogIn, LogOut, Clock, Users } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { attendanceService } from '@/services'

const fromDate = ref(new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0])
const toDate = ref(new Date().toISOString().split('T')[0])
const summary = ref(null)
const chartData = ref(null)

async function load() {
  const { data } = await attendanceService.getSummary({ from: fromDate.value, to: toDate.value })
  summary.value = data
  chartData.value = {
    labels: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    datasets: [
      { label: 'Kirdi', data: [42, 45, 40, 44, 38, 20, 10], backgroundColor: '#10b981', borderRadius: 6 },
      { label: 'Ketdi', data: [38, 41, 37, 40, 35, 18, 8], backgroundColor: '#6366f1', borderRadius: 6 },
    ],
  }
}

onMounted(load)
</script>

<style scoped lang="scss">
.summary-page { display: flex; flex-direction: column; gap: 1.25rem; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.date-range { display: flex; align-items: center; gap: 0.5rem; }
.date-input {
  padding: 0.5rem 0.85rem; border: 1px solid var(--border-color);
  border-radius: 10px; background: var(--bg-surface);
  color: var(--text-primary); font-size: 0.85rem;
}
.stats-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.s-card {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.65rem 1.25rem;
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  border-radius: 12px; color: var(--c); font-size: 0.9rem;
  strong { font-weight: 800; }
}
</style>
