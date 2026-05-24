<template>
  <div class="guard-layout">
    <header class="guard-header">
      <div class="brand">
        <ShieldCheck :size="22" />
        <span>Nazorat Tizimi</span>
      </div>
      <nav class="guard-nav">
        <RouterLink to="/guard/scanner" class="nav-link">
          <ScanLine :size="18" /> Skaner
        </RouterLink>
        <RouterLink to="/guard/live" class="nav-link">
          <Radio :size="18" /> Jonli
        </RouterLink>
      </nav>
      <div class="guard-user">
        <UserAvatar :name="authStore.user?.full_name" :size="34" />
        <span>{{ authStore.user?.full_name }}</span>
        <button class="logout-btn" @click="logout">
          <LogOut :size="16" />
        </button>
      </div>
    </header>
    <main class="guard-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ShieldCheck, ScanLine, Radio, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.guard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
}
.guard-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.brand {
  display: flex; align-items: center; gap: 0.5rem;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--primary);
}
.guard-nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}
.nav-link {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.15s;
  &:hover { background: var(--bg-elevated); color: var(--text-primary); }
  &.router-link-active { background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); }
}
.guard-user {
  display: flex; align-items: center; gap: 0.65rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}
.logout-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
  &:hover { background: color-mix(in srgb, var(--danger) 10%, transparent); color: var(--danger); border-color: var(--danger); }
}
.guard-main {
  flex: 1;
  padding: 2rem 1.5rem;
  overflow-y: auto;
}
</style>
