<template>
  <div class="report-page">
    <div class="report-toolbar">
      <h1 class="page-title">Kunlik Hisobot</h1>
      <div class="toolbar-right">
        <input type="date" v-model="selectedDate" class="date-input" @change="load" />
      </div>
    </div>

    <div class="summary-cards">
      <div class="s-card" style="--c:#10b981">
        <LogIn :size="20" /> <span>Kirdi: <strong>{{ checkins }}</strong></span>
      </div>
      <div class="s-card" style="--c:#ef4444">
        <LogOut :size="20" /> <span>Ketdi: <strong>{{ checkouts }}</strong></span>
      </div>
      <div class="s-card" style="--c:#f59e0b">
        <Clock :size="20" /> <span>Kech: <strong>{{ lates }}</strong></span>
      </div>
    </div>

    <div class="filter-bar">
      <select v-model="filterType" class="select-filter">
        <option value="">Hammasi</option>
        <option value="checkin">Faqat kirdi</option>
        <option value="checkout">Faqat ketdi</option>
      </select>
      <select v-model="filterCategory" class="select-filter">
        <option value="">Barcha kategoriya</option>
        <option value="student">O'quvchilar</option>
        <option value="teacher">O'qituvchilar</option>
        <option value="staff">Xodimlar</option>
      </select>
    </div>

    <AppTable :columns="columns" :rows="filteredLogs" :loading="loading">
      <template #cell-user="{ row }">
        <div class="user-cell">
          <UserAvatar :name="row.user?.full_name" :size="32" />
          <div>
            <p class="cell-name">{{ row.user?.full_name }}</p>
            <span class="cell-sub">{{ row.user?.class?.name }}</span>
          </div>
        </div>
      </template>
      <template #cell-category="{ row }">
        <AppBadge :variant="catVariant(row.user?.category?.slug)">
          {{ row.user?.category?.name }}
        </AppBadge>
      </template>
      <template #cell-type="{ row }">
        <AppBadge :variant="row.type === 'checkin' ? 'success' : 'danger'">
          {{ row.type === 'checkin' ? '→ Kirdi' : '← Ketdi' }}
        </AppBadge>
      </template>
      <template #cell-time="{ row }">{{ formatTime(row.scanned_at) }}</template>
      <template #cell-late="{ row }">
        <AppBadge v-if="row.is_late" variant="warning">Kech</AppBadge>
        <span v-else class="on-time">O'z vaqtida</span>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LogIn, LogOut, Clock } from 'lucide-vue-next'
import AppTable from '@/components/ui/AppTable.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatTime } from '@/utils/formatters'

const store = useAttendanceStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])
const filterType = ref('')
const filterCategory = ref('')
const loading = ref(true)

const columns = [
  { key: 'user', label: 'Shaxs' },
  { key: 'category', label: 'Kategoriya' },
  { key: 'type', label: 'Harakat' },
  { key: 'time', label: 'Vaqt' },
  { key: 'late', label: 'Holat' },
]

const logs = computed(() => store.dailyLogs)
const checkins = computed(() => logs.value.filter((l) => l.type === 'checkin').length)
const checkouts = computed(() => logs.value.filter((l) => l.type === 'checkout').length)
const lates = computed(() => logs.value.filter((l) => l.is_late).length)

const filteredLogs = computed(() => {
  let res = logs.value
  if (filterType.value) res = res.filter((l) => l.type === filterType.value)
  if (filterCategory.value) res = res.filter((l) => l.user?.category?.slug === filterCategory.value)
  return res
})

const catVariant = (s) => ({ student: 'primary', teacher: 'success', staff: 'warning' }[s] ?? 'default')

async function load() {
  loading.value = true
  await store.fetchDaily(selectedDate.value)
  loading.value = false
}

onMounted(load)
</script>

<style scoped lang="scss">
.report-page { display: flex; flex-direction: column; gap: 1.25rem; }
.report-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.date-input {
  padding: 0.55rem 0.9rem; border: 1px solid var(--border-color);
  border-radius: 10px; background: var(--bg-surface);
  color: var(--text-primary); font-size: 0.88rem;
  &:focus { outline: none; border-color: var(--primary); }
}
.summary-cards { display: flex; gap: 1rem; flex-wrap: wrap; }
.s-card {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.65rem 1.25rem;
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  border-radius: 12px; color: var(--c); font-size: 0.9rem;
  strong { font-weight: 800; }
}
.filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.select-filter {
  padding: 0.5rem 0.85rem; border: 1px solid var(--border-color);
  border-radius: 10px; background: var(--bg-surface);
  color: var(--text-primary); font-size: 0.85rem;
  &:focus { outline: none; border-color: var(--primary); }
}
.user-cell { display: flex; align-items: center; gap: 0.65rem; }
.cell-name { font-weight: 600; font-size: 0.88rem; color: var(--text-primary); margin: 0 0 0.1rem; }
.cell-sub { font-size: 0.75rem; color: var(--text-muted); }
.on-time { font-size: 0.8rem; color: var(--text-muted); }
</style>
