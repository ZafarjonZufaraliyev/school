<template>
  <div class="app-layout">
    <AppSidebar
      :navItems="navItems"
      :collapsed="sidebarCollapsed"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />
    <div class="layout-main">
      <AppHeader :title="pageTitle" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  ClipboardList,
  FolderOpen,
  Star,
  UserCheck,
  Calendar,
  User,
} from 'lucide-vue-next'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/assignments', label: 'Topshiriqlar', icon: ClipboardList },
  { to: '/student/resources', label: 'Resurslar', icon: FolderOpen },
  { to: '/student/grades', label: 'Baholar', icon: Star },
  { to: '/student/attendance', label: 'Davomat', icon: UserCheck },
  { to: '/student/schedule', label: 'Dars jadvali', icon: Calendar },
  { to: '/student/profile', label: 'Profil', icon: User },
]

const titleMap = {
  'student-dashboard': 'Dashboard',
  'student-assignments': 'Topshiriqlar',
  'student-resources': 'Resurslar',
  'student-grades': 'Baholar',
  'student-attendance': 'Davomat',
  'student-schedule': 'Dars jadvali',
  'student-profile': 'Profil',
}
const pageTitle = computed(() => titleMap[route.name] || "O'quvchi paneli")
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;
}
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.layout-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
