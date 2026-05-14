<template>
  <aside class="sidebar" :class="{ collapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">E</div>
      <Transition name="fade">
        <span v-if="!collapsed" class="logo-text">EduUz</span>
      </Transition>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <component :is="item.icon" :size="20" class="nav-icon" />
        <Transition name="fade">
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </Transition>
        <span v-if="!collapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <!-- Collapse toggle -->
    <button class="collapse-btn" @click="$emit('toggle')">
      <ChevronLeft v-if="!collapsed" :size="18" />
      <ChevronRight v-else :size="18" />
    </button>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps({
  navItems: { type: Array, default: () => [] },
  collapsed: { type: Boolean, default: false },
})
defineEmits(['toggle'])

const route = useRoute()
const isActive = (path) => route.path.startsWith(path)
</script>

<style scoped lang="scss">
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  flex-shrink: 0;
  &.collapsed {
    width: 72px;
  }
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  white-space: nowrap;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  color: var(--text-sidebar);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    background: var(--bg-sidebar-hover);
    color: #fff;
  }
  &.active {
    background: var(--primary);
    color: #fff;
  }
}
.nav-icon {
  flex-shrink: 0;
}
.nav-label {
  font-size: 0.9rem;
  font-weight: 500;
}
.nav-badge {
  margin-left: auto;
  background: var(--danger);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 99px;
  min-width: 20px;
  text-align: center;
}
.collapse-btn {
  margin: 0.75rem;
  padding: 0.6rem;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-sidebar);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
