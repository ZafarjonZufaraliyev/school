<template>
  <div class="live-monitor">
    <div class="live-header">
      <div class="live-badge">
        <span class="pulse-dot"></span>
        Jonli
      </div>
      <span class="live-count">Hozir ichida: <strong>{{ liveList.length }}</strong> kishi</span>
      <button class="refresh-btn" @click="refresh" :disabled="loading">
        <RefreshCw :size="16" :class="{ spinning: loading }" />
        Yangilash
      </button>
    </div>

    <div class="filter-bar">
      <button
        v-for="cat in ['Hammasi', ...categoryNames]"
        :key="cat"
        class="filter-btn"
        :class="{ active: activeFilter === cat }"
        @click="activeFilter = cat"
      >{{ cat }}</button>
    </div>

    <div v-if="loading" class="skeleton-grid">
      <AppSkeleton v-for="i in 8" :key="i" height="90px" radius="12px" />
    </div>

    <div v-else-if="filteredList.length" class="person-grid">
      <div v-for="log in filteredList" :key="log.id" class="person-card">
        <UserAvatar :name="log.user?.full_name" :size="44" />
        <div class="person-info">
          <p class="person-name">{{ log.user?.full_name }}</p>
          <span class="person-class">{{ log.user?.class?.name }}</span>
          <div class="person-meta">
            <AppBadge :variant="categoryVariant(log.user?.category?.slug)" size="sm">
              {{ log.user?.category?.name }}
            </AppBadge>
            <span class="person-time">{{ formatTime(log.scanned_at) }} dan</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-monitor">
      <Users :size="48" />
      <p>Hozir hech kim ichida yo'q</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Users, RefreshCw } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatTime } from '@/utils/formatters'

const attendanceStore = useAttendanceStore()
const loading = ref(true)
const activeFilter = ref('Hammasi')

const liveList = computed(() => attendanceStore.liveList)

const categoryNames = computed(() => {
  const names = new Set(liveList.value.map((l) => l.user?.category?.name).filter(Boolean))
  return [...names]
})

const filteredList = computed(() => {
  if (activeFilter.value === 'Hammasi') return liveList.value
  return liveList.value.filter((l) => l.user?.category?.name === activeFilter.value)
})

function categoryVariant(slug) {
  return { student: 'primary', teacher: 'success', staff: 'warning' }[slug] ?? 'default'
}

async function refresh() {
  loading.value = true
  await attendanceStore.fetchLive()
  loading.value = false
}

let timer
onMounted(async () => {
  await refresh()
  timer = setInterval(refresh, 15000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped lang="scss">
.live-monitor { display: flex; flex-direction: column; gap: 1.25rem; }

.live-header {
  display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
}
.live-badge {
  display: flex; align-items: center; gap: 0.5rem;
  background: color-mix(in srgb, var(--success) 15%, transparent);
  color: var(--success);
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}
.pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}
.live-count { font-size: 0.9rem; color: var(--text-secondary); flex: 1; }
.refresh-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-primary);
  transition: background 0.15s;
  &:hover { background: var(--bg-elevated); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filter-btn {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  cursor: pointer;
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: all 0.15s;
  &.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }
}

.skeleton-grid,
.person-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
.person-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: var(--shadow-md); }
}
.person-info { flex: 1; min-width: 0; }
.person-name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin: 0 0 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.person-class { font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem; }
.person-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.person-time { font-size: 0.75rem; color: var(--text-muted); }

.empty-monitor {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.75rem; padding: 4rem 2rem;
  color: var(--text-muted);
  p { font-size: 1rem; }
}
</style>
