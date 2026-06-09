<template>
  <div class="scanner-page">
    <div class="scanner-col">
      <div class="scanner-card">
        <div class="scanner-tabs">
          <button :class="{ active: mode === 'camera' }" @click="mode = 'camera'">
            <Camera :size="16" /> Kamera
          </button>
          <button :class="{ active: mode === 'manual' }" @click="mode = 'manual'">
            <Keyboard :size="16" /> Qo'lda kiritish
          </button>
        </div>

        <!-- Camera Mode -->
        <div v-if="mode === 'camera'" class="camera-wrapper">
          <div id="qr-reader" class="qr-reader"></div>
          <p class="scan-hint">QR kodni kamera oldiga tuting</p>
          <div class="direction-info">
            <div class="dir-item checkin">
              <ArrowRightCircle :size="16" />
              <span>Oldingi tomon = Kirdi</span>
            </div>
            <div class="dir-item checkout">
              <ArrowLeftCircle :size="16" />
              <span>Orqa tomon = Ketdi</span>
            </div>
          </div>
        </div>

        <!-- Manual Mode -->
        <div v-else class="manual-wrapper">
          <label class="field-label">QR kod qiymatini kiriting</label>
          <input
            v-model="manualCode"
            class="manual-input"
            placeholder="QR_IN_... yoki QR_OUT_..."
            @keyup.enter="processCode(manualCode)"
          />
          <button class="scan-btn" @click="processCode(manualCode)" :disabled="!manualCode || scanning">
            <Search :size="16" />
            {{ scanning ? 'Tekshirilmoqda...' : 'Tekshirish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Result Panel -->
    <div class="result-col">
      <transition name="result-slide">
        <div v-if="lastResult" class="result-card" :class="resultClass">
          <div class="result-icon">
            <component :is="resultIcon" :size="40" />
          </div>
          <div class="result-body">
            <p class="result-type">{{ resultTypeLabel }}</p>
            <h2 class="result-name">{{ lastResult.user?.full_name }}</h2>
            <p class="result-class">{{ lastResult.user?.class?.name }}</p>
            <AppBadge :variant="categoryVariant(lastResult.user?.category?.slug)">
              {{ lastResult.user?.category?.name }}
            </AppBadge>
            <p class="result-time">{{ formatDateTime(lastResult.log?.scanned_at) }}</p>
          </div>
        </div>
        <div v-else class="result-empty">
          <ScanLine :size="52" />
          <p>QR kodni skanerlang</p>
          <small>Natija shu yerda ko'rinadi</small>
        </div>
      </transition>

      <div v-if="errorMsg" class="error-banner">
        <AlertCircle :size="18" /> {{ errorMsg }}
      </div>

      <!-- Recent scans -->
      <div class="recent-scans">
        <h3 class="recent-title">Oxirgi skanlar</h3>
        <div class="recent-list">
          <div v-for="item in recentScans" :key="item.id" class="recent-item" :class="item.type">
            <UserAvatar :name="item.user?.full_name" :size="32" />
            <div class="recent-info">
              <span class="recent-name">{{ item.user?.full_name }}</span>
              <span class="recent-meta">{{ item.user?.class?.name }}</span>
            </div>
            <div class="recent-badge-wrap">
              <AppBadge :variant="item.type === 'checkin' ? 'success' : 'danger'" size="sm">
                {{ item.type === 'checkin' ? '→ Kirdi' : '← Ketdi' }}
              </AppBadge>
              <span class="recent-time">{{ formatTime(item.scanned_at) }}</span>
            </div>
          </div>
          <div v-if="!recentScans.length" class="recent-empty">Hali skan amalga oshirilmadi</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Camera, Keyboard, Search, ScanLine,
  AlertCircle, ArrowRightCircle, ArrowLeftCircle,
  CheckCircle, XCircle,
} from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAttendanceStore } from '@/stores/attendance.store'
import { formatTime, formatDateTime } from '@/utils/formatters'

const attendanceStore = useAttendanceStore()
const mode = ref('camera')
const manualCode = ref('')
const scanning = ref(false)
const lastResult = ref(null)
const errorMsg = ref('')
const recentScans = ref([])

let html5QrCode = null
let cooldownTimer = null
const COOLDOWN_MS = 3000

const resultClass = computed(() => {
  if (!lastResult.value) return ''
  return lastResult.value.log?.type === 'checkin' ? 'checkin' : 'checkout'
})
const resultIcon = computed(() => {
  if (!lastResult.value) return null
  return lastResult.value.log?.type === 'checkin' ? CheckCircle : XCircle
})
const resultTypeLabel = computed(() => {
  if (!lastResult.value) return ''
  return lastResult.value.log?.type === 'checkin' ? '→ KIRDI' : '← CHIQDI'
})

function categoryVariant(slug) {
  return { student: 'primary', teacher: 'success', staff: 'warning' }[slug] ?? 'default'
}

async function processCode(code) {
  if (!code || scanning.value) return
  scanning.value = true
  errorMsg.value = ''
  try {
    const data = await attendanceStore.scan(code)
    lastResult.value = data
    recentScans.value.unshift(data.log)
    if (recentScans.value.length > 10) recentScans.value.pop()
    manualCode.value = ''
    // cooldown: keyingi scan uchun kutish
    cooldownTimer = setTimeout(() => { scanning.value = false }, COOLDOWN_MS)
  } catch (err) {
    errorMsg.value = err.response?.data?.message ?? 'QR kod noto\'g\'ri yoki topilmadi'
    setTimeout(() => { errorMsg.value = '' }, 3000)
    scanning.value = false
  }
}

async function startCamera() {
  const { Html5Qrcode } = await import('html5-qrcode')
  html5QrCode = new Html5Qrcode('qr-reader')
  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => processCode(decodedText),
      () => {},
    )
  } catch {
    errorMsg.value = 'Kamera ochilmadi. Ruxsat bering yoki qo\'lda kiritish rejimini ishlating.'
  }
}

async function stopCamera() {
  if (html5QrCode?.isScanning) {
    await html5QrCode.stop()
  }
  if (cooldownTimer) clearTimeout(cooldownTimer)
}

onMounted(() => { if (mode.value === 'camera') startCamera() })
onUnmounted(() => stopCamera())
</script>

<style scoped lang="scss">
.scanner-page {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 1.5rem;
  align-items: start;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
}

.scanner-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  overflow: hidden;
}
.scanner-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  button {
    flex: 1; padding: 0.9rem;
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    background: transparent; border: none; cursor: pointer;
    font-size: 0.88rem; color: var(--text-muted);
    transition: all 0.15s;
    &.active { color: var(--primary); background: color-mix(in srgb, var(--primary) 8%, transparent); border-bottom: 2px solid var(--primary); }
  }
}
.camera-wrapper { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.qr-reader { width: 100%; border-radius: 12px; overflow: hidden; }
.scan-hint { text-align: center; font-size: 0.82rem; color: var(--text-muted); }
.direction-info {
  display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;
}
.dir-item {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem; font-weight: 600;
  &.checkin { background: color-mix(in srgb, var(--success) 12%, transparent); color: var(--success); }
  &.checkout { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }
}
.manual-wrapper {
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
}
.field-label { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
.manual-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-base);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: monospace;
  &:focus { outline: none; border-color: var(--primary); }
}
.scan-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.75rem;
  background: var(--primary); color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-size: 0.9rem; font-weight: 600;
  transition: opacity 0.15s;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

/* Result panel */
.result-col { display: flex; flex-direction: column; gap: 1rem; }

.result-card {
  border-radius: 18px;
  padding: 2rem;
  display: flex; align-items: center; gap: 1.5rem;
  &.checkin { background: color-mix(in srgb, var(--success) 10%, transparent); border: 2px solid var(--success); }
  &.checkout { background: color-mix(in srgb, var(--danger) 10%, transparent); border: 2px solid var(--danger); }
}
.result-icon { .checkin & { color: var(--success); } .checkout & { color: var(--danger); } }
.result-body { display: flex; flex-direction: column; gap: 0.3rem; }
.result-type { font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; .checkin & { color: var(--success); } .checkout & { color: var(--danger); } }
.result-name { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.result-class { font-size: 0.85rem; color: var(--text-muted); }
.result-time { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }

.result-empty {
  background: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: 18px;
  padding: 3rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  color: var(--text-muted);
  p { font-size: 1rem; font-weight: 600; }
  small { font-size: 0.82rem; }
}

.error-banner {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--danger) 10%, transparent);
  border: 1px solid var(--danger);
  border-radius: 10px;
  color: var(--danger);
  font-size: 0.88rem;
}

.recent-scans {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
}
.recent-title {
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  margin: 0;
}
.recent-list { display: flex; flex-direction: column; }
.recent-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--border-color);
  &:last-child { border-bottom: none; }
}
.recent-info { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
.recent-name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
.recent-meta { font-size: 0.75rem; color: var(--text-muted); }
.recent-badge-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 0.15rem; }
.recent-time { font-size: 0.72rem; color: var(--text-muted); }
.recent-empty { padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem; }

.result-slide-enter-active, .result-slide-leave-active { transition: all 0.3s ease; }
.result-slide-enter-from { opacity: 0; transform: translateY(-10px); }
.result-slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
