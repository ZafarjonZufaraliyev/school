<template>
  <div class="guard-live">
    <div class="live-header">
      <div class="live-badge"><span class="pulse"></span> Jonli</div>
      <span class="count">Hozir ichida: <strong>{{ liveList.length }}</strong></span>
    </div>

    <div v-if="loading" class="skeleton-grid">
      <AppSkeleton v-for="i in 6" :key="i" height="80px" radius="12px" />
    </div>
    <div v-else-if="liveList.length" class="live-grid">
      <div v-for="log in liveList" :key="log.id" class="live-card">
        <UserAvatar :name="log.user?.full_name" :size="42" />
        <div class="info">
          <p class="name">{{ log.user?.full_name }}</p>
          <span class="cls">{{ log.user?.class?.name }}</span>
          <AppBadge :variant="catVariant(log.user?.category?.slug)" size="sm">
            {{ log.user?.category?.name }}
          </AppBadge>
        </div>
        <span class="time">{{ formatTime(log.scanned_at) }}</span>
      </div>
    </div>
    <div v-else class="empty"><Users :size="42" /><p>Hech kim ichida yo'q</p></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Users } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatTime } from '@/utils/formatters'

const store = useAttendanceStore()
const loading = ref(true)
const liveList = computed(() => store.liveList)
const catVariant = (s) => ({ student: 'primary', teacher: 'success', staff: 'warning' }[s] ?? 'default')

let timer
onMounted(async () => {
  await store.fetchLive()
  loading.value = false
  timer = setInterval(async () => { await store.fetchLive() }, 15000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped lang="scss">
.guard-live { display: flex; flex-direction: column; gap: 1.25rem; }
.live-header { display: flex; align-items: center; gap: 1rem; }
.live-badge {
  display: flex; align-items: center; gap: 0.45rem;
  background: color-mix(in srgb, var(--success) 15%, transparent);
  color: var(--success); padding: 0.3rem 0.85rem;
  border-radius: 20px; font-size: 0.82rem; font-weight: 700;
}
.pulse {
  width: 8px; height: 8px; border-radius: 50%; background: var(--success);
  animation: p 1.5s infinite;
}
@keyframes p { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)} }
.count { font-size: 0.9rem; color: var(--text-muted); }
.skeleton-grid, .live-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.85rem;
}
.live-card {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 14px; padding: 1rem;
  display: flex; align-items: flex-start; gap: 0.75rem;
}
.info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
.name { font-weight: 700; font-size: 0.88rem; color: var(--text-primary); margin: 0; }
.cls { font-size: 0.75rem; color: var(--text-muted); }
.time { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }
.empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem; color: var(--text-muted); }
</style>
