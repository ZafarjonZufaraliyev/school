<template>
  <div class="history-page">
    <h1 class="page-title">Mening Tarixim</h1>

    <div class="filter-bar">
      <input type="date" v-model="selectedDate" class="date-input" @change="load" />
      <button class="clear-btn" v-if="selectedDate" @click="selectedDate = ''; load()">
        Tozalash
      </button>
    </div>

    <div class="summary-row">
      <div class="summary-item checkin">
        <LogIn :size="18" />
        <span>Kirdi: <strong>{{ checkinCount }}</strong></span>
      </div>
      <div class="summary-item checkout">
        <LogOut :size="18" />
        <span>Ketdi: <strong>{{ checkoutCount }}</strong></span>
      </div>
    </div>

    <div v-if="loading" class="skeleton-list">
      <AppSkeleton v-for="i in 6" :key="i" height="64px" radius="10px" />
    </div>

    <div v-else class="log-list">
      <div v-for="log in logs" :key="log.id" class="log-item" :class="log.type">
        <div class="log-icon">
          <LogIn v-if="log.type === 'checkin'" :size="20" />
          <LogOut v-else :size="20" />
        </div>
        <div class="log-info">
          <p class="log-action">{{ log.type === 'checkin' ? 'Muassasaga kirdi' : 'Muassasadan chiqdi' }}</p>
          <span class="log-date">{{ formatDate(log.scanned_at) }}</span>
        </div>
        <span class="log-time">{{ formatTime(log.scanned_at) }}</span>
      </div>
      <div v-if="!logs.length" class="empty-state">
        <History :size="40" />
        <p>Bu sana uchun yozuv topilmadi</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LogIn, LogOut, History } from 'lucide-vue-next'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { useAuthStore } from '@/stores/auth.store'
import { formatTime, formatDate } from '@/utils/formatters'

const attendanceStore = useAttendanceStore()
const authStore = useAuthStore()

const logs = ref([])
const loading = ref(true)
const selectedDate = ref('')

const checkinCount = computed(() => logs.value.filter((l) => l.type === 'checkin').length)
const checkoutCount = computed(() => logs.value.filter((l) => l.type === 'checkout').length)

async function load() {
  loading.value = true
  try {
    const params = selectedDate.value ? { date: selectedDate.value } : {}
    logs.value = await attendanceStore.fetchByUser(authStore.user?.id, params)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped lang="scss">
.history-page { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }

.filter-bar { display: flex; gap: 0.75rem; align-items: center; }
.date-input {
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.88rem;
  &:focus { outline: none; border-color: var(--primary); }
}
.clear-btn {
  padding: 0.55rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: transparent; cursor: pointer;
  font-size: 0.85rem; color: var(--text-muted);
  transition: all 0.15s;
  &:hover { border-color: var(--danger); color: var(--danger); }
}

.summary-row { display: flex; gap: 1rem; }
.summary-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.88rem;
  &.checkin { background: color-mix(in srgb, var(--success) 12%, transparent); color: var(--success); }
  &.checkout { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }
  strong { font-weight: 800; }
}

.skeleton-list, .log-list { display: flex; flex-direction: column; gap: 0.5rem; }
.log-item {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: var(--shadow-sm); }
}
.log-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  .checkin & { background: color-mix(in srgb, var(--success) 15%, transparent); color: var(--success); }
  .checkout & { background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger); }
}
.log-info { flex: 1; }
.log-action { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.15rem; }
.log-date { font-size: 0.78rem; color: var(--text-muted); }
.log-time { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 3rem; color: var(--text-muted);
  p { font-size: 0.95rem; }
}
</style>
