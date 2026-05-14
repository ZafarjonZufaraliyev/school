<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <Menu :size="22" />
      </button>
      <h1 class="page-heading">{{ title }}</h1>
    </div>
    <div class="header-right">
      <!-- Theme toggle -->
      <button class="icon-btn" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
        <Sun v-if="isDark" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <!-- Notifications -->
      <NotificationBell />

      <!-- User menu -->
      <div class="user-menu" @click="showMenu = !showMenu" ref="menuRef">
        <UserAvatar :name="user?.full_name || user?.username" :size="36" />
        <div class="user-info">
          <span class="user-name">{{ user?.full_name || user?.username }}</span>
          <span class="user-role">{{ roleLabel }}</span>
        </div>
        <ChevronDown :size="16" class="chevron" :class="{ rotated: showMenu }" />

        <Transition name="slide-up">
          <div v-if="showMenu" class="dropdown">
            <RouterLink :to="profileLink" class="dropdown-item" @click="showMenu = false">
              <User :size="16" /> Profil
            </RouterLink>
            <button class="dropdown-item danger" @click="handleLogout">
              <LogOut :size="16" /> Chiqish
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Menu, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import NotificationBell from './NotificationBell.vue'

defineProps({ title: { type: String, default: '' } })
defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { logout } = useAuth()

const user = computed(() => authStore.user)
const showMenu = ref(false)
const menuRef = ref(null)

const roleLabel = computed(
  () =>
    ({
      admin: 'Administrator',
      teacher: "O'qituvchi",
      student: "O'quvchi",
    })[authStore.userRole] || '',
)

const profileLink = computed(() => {
  const r = authStore.userRole
  if (r === 'student') return '/student/profile'
  return '#'
})

async function handleLogout() {
  showMenu.value = false
  await logout()
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) showMenu.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped lang="scss">
.app-header {
  height: 64px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.menu-btn,
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.15s;
  &:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }
}
.page-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  position: relative;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.chevron {
  color: var(--text-muted);
  transition: transform 0.2s;
  &.rotated {
    transform: rotate(180deg);
  }
}
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 200;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
  }
  &.danger {
    color: var(--danger);
    &:hover {
      background: var(--danger-light);
    }
  }
}
@media (max-width: 640px) {
  .user-info {
    display: none;
  }
}
</style>
