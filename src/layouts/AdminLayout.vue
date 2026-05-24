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
import { LayoutDashboard, Users, FileBarChart, FileText, Settings, Radio } from 'lucide-vue-next'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/live', label: 'Jonli Monitoring', icon: Radio },
  { to: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
  { to: '/admin/reports/daily', label: 'Kunlik Hisobot', icon: FileText },
  { to: '/admin/reports/summary', label: 'Umumiy Hisobot', icon: FileBarChart },
  { to: '/admin/settings', label: 'Sozlamalar', icon: Settings },
]

const titleMap = {
  'admin-dashboard': 'Bosh sahifa',
  'admin-live': 'Jonli Monitoring',
  'admin-users': 'Foydalanuvchilar',
  'admin-user-detail': 'Foydalanuvchi',
  'admin-report-daily': 'Kunlik Hisobot',
  'admin-report-summary': 'Umumiy Hisobot',
  'admin-settings': 'Sozlamalar',
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
