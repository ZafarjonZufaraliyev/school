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
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  FolderOpen,
  UserPlus,
} from 'lucide-vue-next'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Foydalanuvchilar', icon: UserPlus },
  { to: '/admin/students', label: "O'quvchilar", icon: GraduationCap },
  { to: '/admin/teachers', label: "O'qituvchilar", icon: Users },
  { to: '/admin/groups', label: 'Guruhlar', icon: BookOpen },
  { to: '/admin/subjects', label: 'Fanlar', icon: FileText },
  { to: '/admin/schedule', label: 'Dars jadvali', icon: Calendar },
  { to: '/admin/statistics/attendance', label: 'Davomat stat.', icon: BarChart3 },
  { to: '/admin/statistics/grades', label: "O'zlashtirish", icon: BarChart3 },
  { to: '/admin/statistics/weekly', label: 'Haftalik natija', icon: BarChart3 },
  { to: '/admin/resources', label: 'Resurslar', icon: FolderOpen },
]

const titleMap = {
  'admin-dashboard': 'Dashboard',
  'admin-users': 'Foydalanuvchilar',
  'admin-students': "O'quvchilar",
  'admin-teachers': "O'qituvchilar",
  'admin-groups': 'Guruhlar',
  'admin-subjects': 'Fanlar',
  'admin-schedule': 'Dars jadvali',
  'admin-attendance-stat': 'Davomat statistikasi',
  'admin-grades-stat': "O'zlashtirish statistikasi",
  'admin-weekly': 'Haftalik natijalar',
  'admin-resources': 'Resurslar',
}
const pageTitle = computed(() => titleMap[route.name] || 'Admin Panel')
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
