<template>
  <div class="qr-page">
    <div class="qr-intro">
      <h1 class="qr-title">Sizning QR Kartangiz</h1>
      <p class="qr-desc">
        Kirishda <strong>oldingi tomonni</strong>, chiqishda <strong>orqa tomonni</strong> ko'rsating.
      </p>
    </div>

    <div class="card-container">
      <!-- Kirish QR -->
      <div class="qr-card checkin">
        <div class="card-label">
          <ArrowRightCircle :size="20" />
          KIRISH
        </div>
        <div class="qr-box">
          <vue-qrcode
            v-if="qrData.qr_checkin"
            :value="qrData.qr_checkin"
            :options="qrOptions"
            class="qr-img"
          />
          <AppSkeleton v-else width="220px" height="220px" radius="12px" />
        </div>
        <div class="card-user">
          <UserAvatar :name="authStore.user?.full_name" :size="36" />
          <div>
            <p class="user-name">{{ authStore.user?.full_name }}</p>
            <p class="user-class">{{ authStore.user?.class?.name }}</p>
          </div>
        </div>
        <p class="card-hint">Oldingi tomon — Kelganda ko'rsating</p>
        <button class="print-btn" @click="print('checkin')">
          <Printer :size="15" /> Chop etish
        </button>
      </div>

      <!-- Chiqish QR -->
      <div class="qr-card checkout">
        <div class="card-label">
          <ArrowLeftCircle :size="20" />
          CHIQISH
        </div>
        <div class="qr-box">
          <vue-qrcode
            v-if="qrData.qr_checkout"
            :value="qrData.qr_checkout"
            :options="qrOptions"
            class="qr-img"
          />
          <AppSkeleton v-else width="220px" height="220px" radius="12px" />
        </div>
        <div class="card-user">
          <UserAvatar :name="authStore.user?.full_name" :size="36" />
          <div>
            <p class="user-name">{{ authStore.user?.full_name }}</p>
            <p class="user-class">{{ authStore.user?.class?.name }}</p>
          </div>
        </div>
        <p class="card-hint">Orqa tomon — Ketganda ko'rsating</p>
        <button class="print-btn" @click="print('checkout')">
          <Printer :size="15" /> Chop etish
        </button>
      </div>
    </div>

    <div class="qr-footer">
      <AlertTriangle :size="16" />
      QR kodingizni boshqalarga ko'rsatmang. Yo'qolsa admin bilan bog'laning.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRightCircle, ArrowLeftCircle, Printer, AlertTriangle } from 'lucide-vue-next'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUsersStore } from '@/stores/users.store'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const qrData = ref({ qr_checkin: '', qr_checkout: '' })

const qrOptions = {
  errorCorrectionLevel: 'M',
  width: 220,
  margin: 2,
  color: { dark: '#1a1a2e', light: '#ffffff' },
}

function print(type) {
  const val = type === 'checkin' ? qrData.value.qr_checkin : qrData.value.qr_checkout
  const label = type === 'checkin' ? 'KIRISH' : 'CHIQISH'
  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>QR Karta — ${label}</title>
    <style>body{display:flex;flex-direction:column;align-items:center;font-family:sans-serif;padding:2rem;}
    h2{font-size:1.5rem;margin-bottom:0.5rem;}p{color:#666;}
    </style></head><body>
    <h2>${authStore.user?.full_name}</h2>
    <p>${authStore.user?.class?.name ?? ''} · ${label}</p>
    <canvas id="qr"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"><\/script>
    <script>QRCode.toCanvas(document.getElementById('qr'),'${val}',{width:280})<\/script>
    </body></html>
  `)
  win.document.close()
  setTimeout(() => win.print(), 800)
}

onMounted(async () => {
  try {
    const data = await usersStore.getUserQr(authStore.user?.id)
    qrData.value = data
  } catch {
    // mock fallback
    qrData.value = {
      qr_checkin: authStore.user?.qr_checkin ?? 'QR_IN_DEMO',
      qr_checkout: authStore.user?.qr_checkout ?? 'QR_OUT_DEMO',
    }
  }
})
</script>

<style scoped lang="scss">
.qr-page {
  max-width: 760px;
  margin: 0 auto;
  display: flex; flex-direction: column; gap: 1.5rem;
}
.qr-intro { text-align: center; }
.qr-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
.qr-desc { color: var(--text-muted); font-size: 0.95rem; }

.card-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

.qr-card {
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  border: 2px solid transparent;
  &.checkin { border-color: var(--success); }
  &.checkout { border-color: var(--danger); }
}
.card-label {
  display: flex; align-items: center; gap: 0.5rem;
  font-weight: 800; font-size: 1rem; letter-spacing: 1px;
  .checkin & { color: var(--success); }
  .checkout & { color: var(--danger); }
}
.qr-box {
  padding: 1rem;
  background: #fff;
  border-radius: 14px;
}
.qr-img { display: block; border-radius: 8px; }
.card-user {
  display: flex; align-items: center; gap: 0.75rem;
  width: 100%;
}
.user-name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin: 0 0 0.1rem; }
.user-class { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
.card-hint {
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  .checkin & { color: var(--success); }
  .checkout & { color: var(--danger); }
}
.print-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-elevated); cursor: pointer;
  font-size: 0.82rem; color: var(--text-secondary);
  transition: all 0.15s;
  &:hover { border-color: var(--primary); color: var(--primary); }
}

.qr-footer {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--warning) 10%, transparent);
  border: 1px solid var(--warning);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.82rem;
}
</style>
