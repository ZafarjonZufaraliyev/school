<template>
  <div class="user-detail" v-if="user">
    <div class="detail-header">
      <UserAvatar :name="user.full_name" :size="60" />
      <div>
        <h2 class="user-name">{{ user.full_name }}</h2>
        <p class="user-sub">{{ user.class?.name }} · {{ user.category?.name }}</p>
      </div>
      <AppBadge :variant="catVariant(user.category?.slug)">{{ user.category?.name }}</AppBadge>
    </div>

    <div class="info-grid">
      <div class="info-item"><span>Login</span><strong>{{ user.username }}</strong></div>
      <div class="info-item"><span>Rol</span><strong>{{ roleName(user.role) }}</strong></div>
      <div class="info-item"><span>Telefon</span><strong>{{ user.phone ?? '—' }}</strong></div>
      <div class="info-item" v-if="user.parent_phone"><span>Ota-ona</span><strong>{{ user.parent_phone }}</strong></div>
    </div>

    <div class="qr-section">
      <h3>QR Kartasi</h3>
      <div class="qr-row">
        <div class="qr-card checkin">
          <p>KIRISH (Oldingi tomon)</p>
          <vue-qrcode v-if="user.qr_checkin" :value="user.qr_checkin" :options="{ width: 180, margin: 2 }" />
        </div>
        <div class="qr-card checkout">
          <p>CHIQISH (Orqa tomon)</p>
          <vue-qrcode v-if="user.qr_checkout" :value="user.qr_checkout" :options="{ width: 180, margin: 2 }" />
        </div>
      </div>
    </div>

    <div class="history-section">
      <h3>Oxirgi harakatlar</h3>
      <div class="log-list">
        <div v-for="log in logs" :key="log.id" class="log-row" :class="log.type">
          <div class="log-icon">
            <LogIn v-if="log.type === 'checkin'" :size="16" />
            <LogOut v-else :size="16" />
          </div>
          <span class="log-label">{{ log.type === 'checkin' ? 'Kirdi' : 'Chiqdi' }}</span>
          <span class="log-date">{{ formatDateTime(log.scanned_at) }}</span>
          <AppBadge v-if="log.is_late" variant="warning" size="sm">Kech</AppBadge>
        </div>
        <div v-if="!logs.length" class="empty">Yozuv topilmadi</div>
      </div>
    </div>
  </div>
  <div v-else class="loading-state"><AppSkeleton height="400px" radius="16px" /></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { LogIn, LogOut } from 'lucide-vue-next'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useUsersStore } from '@/stores/users.store'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatDateTime } from '@/utils/formatters'

const route = useRoute()
const usersStore = useUsersStore()
const attendanceStore = useAttendanceStore()
const user = ref(null)
const logs = ref([])

const catVariant = (s) => ({ student: 'primary', teacher: 'success', staff: 'warning' }[s] ?? 'default')
const roleName = (r) => ({ admin: 'Admin', guard: 'Navbatchi', member: "A'zo" }[r] ?? r)

onMounted(async () => {
  const id = route.params.id
  user.value = await usersStore.fetchUser(id)
  logs.value = await attendanceStore.fetchByUser(id)
})
</script>

<style scoped lang="scss">
.user-detail { display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; }
.detail-header {
  display: flex; align-items: center; gap: 1.25rem;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 18px; padding: 1.5rem;
}
.user-name { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.25rem; }
.user-sub { font-size: 0.85rem; color: var(--text-muted); margin: 0; }

.info-grid {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 14px; overflow: hidden;
}
.info-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.85rem 1.25rem; border-bottom: 1px solid var(--border-color);
  &:last-child { border-bottom: none; }
  span { font-size: 0.85rem; color: var(--text-muted); }
  strong { font-size: 0.9rem; color: var(--text-primary); }
}

.qr-section, .history-section {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 14px; padding: 1.25rem;
  h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }
}
.qr-row { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.qr-card {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1rem; border-radius: 14px;
  &.checkin { border: 2px solid var(--success); }
  &.checkout { border: 2px solid var(--danger); }
  p { font-weight: 800; font-size: 0.78rem; letter-spacing: 0.5px; margin: 0; }
  .checkin & p { color: var(--success); }
  .checkout & p { color: var(--danger); }
}

.log-list { display: flex; flex-direction: column; gap: 0.5rem; }
.log-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.6rem 0.85rem; border-radius: 10px;
  border: 1px solid var(--border-color);
  &.checkin .log-icon { color: var(--success); }
  &.checkout .log-icon { color: var(--danger); }
}
.log-label { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
.log-date { flex: 1; font-size: 0.82rem; color: var(--text-muted); }
.empty { text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem; }
.loading-state { padding: 2rem; }
</style>
