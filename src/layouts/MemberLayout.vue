<template>
  <div class="member-layout">
    <header class="member-header">
      <div class="brand">
        <ShieldCheck :size="20" />
        <span>Kelib-Ketish Tizimi</span>
      </div>
      <nav class="member-nav">
        <RouterLink to="/member/qr" class="nav-link">
          <QrCode :size="17" /> Mening QR
        </RouterLink>
        <RouterLink to="/member/history" class="nav-link">
          <History :size="17" /> Tarixim
        </RouterLink>
        <RouterLink to="/member/profile" class="nav-link">
          <User :size="17" /> Profil
        </RouterLink>
      </nav>
      <button class="logout-btn" @click="logout">
        <LogOut :size="16" />
        Chiqish
      </button>
    </header>
    <main class="member-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ShieldCheck, QrCode, History, User, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.member-layout { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-base); }
.member-header {
  display: flex; align-items: center; gap: 1.25rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}
.brand {
  display: flex; align-items: center; gap: 0.45rem;
  font-weight: 800; font-size: 1rem; color: var(--primary);
}
.member-nav { display: flex; gap: 0.4rem; flex: 1; }
.nav-link {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.87rem; font-weight: 500;
  transition: all 0.15s;
  &:hover { background: var(--bg-elevated); color: var(--text-primary); }
  &.router-link-active { background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); }
}
.logout-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 1rem;
  background: transparent; border: 1px solid var(--border-color);
  border-radius: 8px; cursor: pointer;
  font-size: 0.87rem; color: var(--text-muted);
  transition: all 0.15s;
  &:hover { color: var(--danger); border-color: var(--danger); }
}
.member-main { flex: 1; padding: 2rem 1.5rem; overflow-y: auto; }
</style>
