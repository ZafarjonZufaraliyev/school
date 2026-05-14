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
  BookOpen,
  ClipboardList,
  FolderOpen,
  UserCheck,
  Star,
  Calendar,
} from 'lucide-vue-next'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/groups', label: 'Guruhlarim', icon: BookOpen },
  { to: '/teacher/assignments', label: 'Topshiriqlar', icon: ClipboardList },
  { to: '/teacher/resources', label: 'Resurslar', icon: FolderOpen },
  { to: '/teacher/attendance', label: 'Davomat', icon: UserCheck },
  { to: '/teacher/grades', label: 'Baholar', icon: Star },
  { to: '/teacher/schedule', label: 'Dars jadvali', icon: Calendar },
]

const titleMap = {
  'teacher-dashboard': 'Dashboard',
  'teacher-groups': 'Guruhlarim',
  'teacher-group-detail': 'Guruh tafsiloti',
  'teacher-assignments': 'Topshiriqlar',
  'teacher-assignment-detail': 'Topshiriq tafsiloti',
  'teacher-resources': 'Resurslar',
  'teacher-attendance': 'Davomat',
  'teacher-grades': 'Baholar',
  'teacher-schedule': 'Dars jadvali',
}
const pageTitle = computed(() => titleMap[route.name] || "O'qituvchi paneli")
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
