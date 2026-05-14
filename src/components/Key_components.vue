<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- src/components/layout/AppSidebar.vue                          -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
      'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-sm">OM</span>
        </div>
        <Transition name="fade">
          <span v-if="!isCollapsed" class="font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
            O'quv Markaz
          </span>
        </Transition>
      </div>
      <button
        @click="isCollapsed = !isCollapsed"
        class="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
      >
        <ChevronLeftIcon v-if="!isCollapsed" class="w-4 h-4" />
        <ChevronRightIcon v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1">
      <template v-for="item in navItems" :key="item.name">
        <!-- Group label -->
        <div v-if="item.type === 'label' && !isCollapsed"
          class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4 first:mt-0">
          {{ item.label }}
        </div>

        <!-- Nav item -->
        <RouterLink
          v-else-if="item.type === 'link'"
          :to="item.to"
          class="sidebar-link group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          :class="[
            isActive(item.to)
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          ]"
          v-tooltip="isCollapsed ? item.label : null"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <Transition name="fade">
            <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
          </Transition>
          <!-- Badge -->
          <span v-if="item.badge && !isCollapsed"
            class="ml-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs px-1.5 py-0.5 rounded-full">
            {{ item.badge }}
          </span>
        </RouterLink>
      </template>
    </nav>

    <!-- User info at bottom -->
    <div class="border-t border-gray-100 dark:border-gray-800 p-4">
      <div class="flex items-center gap-3">
        <UserAvatar :user="authStore.user" size="sm" />
        <Transition name="fade">
          <div v-if="!isCollapsed" class="overflow-hidden">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.full_name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
              {{ authStore.user?.role }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  LayoutDashboardIcon, UsersIcon, GraduationCapIcon, BookOpenIcon,
  BookMarkedIcon, CalendarIcon, BarChart3Icon, TrendingUpIcon,
  ActivityIcon, FolderOpenIcon, UserCogIcon, ClipboardListIcon,
  FolderIcon, CheckSquareIcon, ChevronLeftIcon, ChevronRightIcon
} from 'lucide-vue-next'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const route = useRoute()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const isActive = (path) => route.path.startsWith(path)

const adminNav = [
  { type: 'label', label: 'Asosiy' },
  { type: 'link', to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { type: 'label', label: "Foydalanuvchilar" },
  { type: 'link', to: '/admin/students', label: "O'quvchilar", icon: UsersIcon },
  { type: 'link', to: '/admin/teachers', label: "O'qituvchilar", icon: GraduationCapIcon },
  { type: 'link', to: '/admin/users', label: 'Foydalanuvchilar', icon: UserCogIcon },
  { type: 'label', label: "O'quv jarayoni" },
  { type: 'link', to: '/admin/groups', label: 'Guruhlar', icon: BookOpenIcon },
  { type: 'link', to: '/admin/subjects', label: 'Fanlar', icon: BookMarkedIcon },
  { type: 'link', to: '/admin/schedule', label: 'Dars jadvali', icon: CalendarIcon },
  { type: 'link', to: '/admin/resources', label: 'Resurslar', icon: FolderOpenIcon },
  { type: 'label', label: 'Statistika' },
  { type: 'link', to: '/admin/statistics/attendance', label: 'Davomat', icon: BarChart3Icon },
  { type: 'link', to: '/admin/statistics/grades', label: "O'zlashtirish", icon: TrendingUpIcon },
  { type: 'link', to: '/admin/statistics/weekly', label: 'Haftalik', icon: ActivityIcon },
]

const teacherNav = [
  { type: 'label', label: 'Asosiy' },
  { type: 'link', to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { type: 'link', to: '/teacher/groups', label: 'Guruhlarim', icon: BookOpenIcon },
  { type: 'link', to: '/teacher/schedule', label: 'Dars jadvali', icon: CalendarIcon },
  { type: 'label', label: "O'quv" },
  { type: 'link', to: '/teacher/assignments', label: 'Topshiriqlar', icon: ClipboardListIcon },
  { type: 'link', to: '/teacher/resources', label: 'Resurslar', icon: FolderIcon },
  { type: 'label', label: 'Baholash' },
  { type: 'link', to: '/teacher/attendance', label: 'Davomat', icon: CheckSquareIcon },
  { type: 'link', to: '/teacher/grades', label: 'Baholar', icon: BarChart3Icon },
]

const studentNav = [
  { type: 'label', label: 'Asosiy' },
  { type: 'link', to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { type: 'link', to: '/student/schedule', label: 'Dars jadvali', icon: CalendarIcon },
  { type: 'label', label: "O'quv" },
  { type: 'link', to: '/student/assignments', label: 'Vazifalar', icon: ClipboardListIcon },
  { type: 'link', to: '/student/resources', label: 'Resurslar', icon: FolderIcon },
  { type: 'label', label: 'Natijalar' },
  { type: 'link', to: '/student/grades', label: 'Baholar', icon: TrendingUpIcon },
  { type: 'link', to: '/student/attendance', label: 'Davomat', icon: BarChart3Icon },
]

const navItems = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return adminNav
  if (role === 'teacher') return teacherNav
  return studentNav
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- src/views/auth/LoginView.vue                                   -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900 mb-4">
          <span class="text-white font-bold text-2xl">OM</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">O'quv Markaz</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">Boshqaruv tizimiga xush kelibsiz</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Kirish</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Login
            </label>
            <input
              v-model="form.username"
              type="text"
              placeholder="loginni kiriting"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              :class="{ 'border-red-400 focus:ring-red-400': errors.username }"
            />
            <p v-if="errors.username" class="mt-1 text-xs text-red-500">{{ errors.username }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Parol
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="parolni kiriting"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm pr-12"
                :class="{ 'border-red-400 focus:ring-red-400': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Error message -->
          <Transition name="slide-down">
            <div v-if="errorMessage"
              class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-xl">
              <AlertCircleIcon class="w-4 h-4 text-red-500 flex-shrink-0" />
              <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            <LoaderIcon v-if="authStore.isLoading" class="w-4 h-4 animate-spin" />
            <span>{{ authStore.isLoading ? 'Kirish...' : 'Kirish' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { EyeIcon, EyeOffIcon, AlertCircleIcon, LoaderIcon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const errorMessage = ref('')
const showPassword = ref(false)

function validate() {
  errors.username = form.username ? '' : "Login kiritilishi shart"
  errors.password = form.password ? '' : "Parol kiritilishi shart"
  return !errors.username && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  errorMessage.value = ''
  const result = await authStore.login(form)
  if (result.success) {
    const redirect = route.query.redirect || `/${authStore.user.role}/dashboard`
    router.push(redirect)
  } else {
    errorMessage.value = result.message
  }
}
</script>


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- src/components/shared/DeadlineTimer.vue                        -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <div :class="['flex items-center gap-1.5 text-sm font-medium', colorClass]">
    <ClockIcon class="w-4 h-4" />
    <span v-if="isExpired">Muddati tugagan</span>
    <span v-else>{{ formatted }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClockIcon } from 'lucide-vue-next'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const props = defineProps({ deadline: { type: String, required: true } })

const now = ref(dayjs())
let timer = null

const remaining = computed(() => dayjs(props.deadline).diff(now.value))
const isExpired = computed(() => remaining.value <= 0)

const formatted = computed(() => {
  if (isExpired.value) return ''
  const d = dayjs.duration(remaining.value)
  const days = Math.floor(d.asDays())
  if (days > 0) return `${days} kun ${d.hours()} soat`
  if (d.hours() > 0) return `${d.hours()} soat ${d.minutes()} daqiqa`
  return `${d.minutes()} daqiqa ${d.seconds()} soniya`
})

const colorClass = computed(() => {
  if (isExpired.value) return 'text-red-500'
  const hours = remaining.value / (1000 * 60 * 60)
  if (hours < 2) return 'text-red-500'
  if (hours < 24) return 'text-orange-500'
  return 'text-green-600 dark:text-green-400'
})

onMounted(() => { timer = setInterval(() => { now.value = dayjs() }, 1000) })
onUnmounted(() => clearInterval(timer))
</script>