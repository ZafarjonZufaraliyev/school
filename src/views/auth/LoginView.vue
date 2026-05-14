<template>
  <div class="login-card">
    <!-- Header -->
    <div class="login-header">
      <div class="login-logo">E</div>
      <h2>Xush kelibsiz!</h2>
      <p>Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
    </div>

    <!-- Demo credentials -->
    <div class="demo-section">
      <p class="demo-title">Demo kirish ma'lumotlari:</p>
      <div class="demo-cards">
        <button
          v-for="demo in demoUsers"
          :key="demo.role"
          class="demo-card"
          :class="`demo-${demo.role}`"
          @click="fillDemo(demo)"
        >
          <component :is="demo.icon" :size="16" />
          <div class="demo-info">
            <span class="demo-role">{{ demo.label }}</span>
            <span class="demo-cred">{{ demo.username }} / {{ demo.password }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="login-form">
      <AppInput
        v-model="form.username"
        label="Login"
        placeholder="username kiriting"
        :icon="User"
        :error="errors.username"
        autocomplete="username"
      />

      <div class="pass-field">
        <AppInput
          v-model="form.password"
          label="Parol"
          :type="showPass ? 'text' : 'password'"
          placeholder="parol kiriting"
          :icon="Lock"
          :error="errors.password"
          autocomplete="current-password"
        />
        <button type="button" class="show-pass-btn" @click="showPass = !showPass">
          <Eye v-if="!showPass" :size="15" />
          <EyeOff v-else :size="15" />
          {{ showPass ? 'Yashirish' : "Ko'rsatish" }}
        </button>
      </div>

      <AppButton type="submit" :loading="loading" block size="lg">
        <LogIn :size="18" />
        Kirish
      </AppButton>
    </form>

    <!-- Error message -->
    <Transition name="fade">
      <div v-if="errorMsg" class="error-alert">
        <AlertCircle :size="16" />
        {{ errorMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  GraduationCap,
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const { login } = useAuth()

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const loading = ref(false)
const showPass = ref(false)
const errorMsg = ref('')

// Demo foydalanuvchilar — backend tayyor bo'lgach o'zgartiring
const demoUsers = [
  { role: 'admin', label: 'Admin', username: 'admin', password: 'admin123', icon: ShieldCheck },
  {
    role: 'teacher',
    label: "O'qituvchi",
    username: 'teacher',
    password: 'teacher123',
    icon: BookOpen,
  },
  {
    role: 'student',
    label: "O'quvchi",
    username: 'student',
    password: 'student123',
    icon: GraduationCap,
  },
]

function fillDemo(demo) {
  form.username = demo.username
  form.password = demo.password
  errors.username = ''
  errors.password = ''
  errorMsg.value = ''
}

async function handleLogin() {
  errors.username = form.username.trim() ? '' : 'Login kiritilmadi'
  errors.password = form.password ? '' : 'Parol kiritilmadi'
  if (errors.username || errors.password) return

  loading.value = true
  errorMsg.value = ''

  const result = await login({ username: form.username.trim(), password: form.password })
  if (result && !result.success) {
    errorMsg.value = result.message || 'Login yoki parol xato'
  }

  loading.value = false
}
</script>

<style scoped lang="scss">
.login-card {
  background: var(--bg-surface);
  border-radius: 24px;
  padding: 2.25rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Header ── */
.login-header {
  text-align: center;
}
.login-logo {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
}
.login-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
}
.login-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* ── Demo section ── */
.demo-section {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem;
}
.demo-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.65rem;
}
.demo-cards {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.demo-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1.5px solid transparent;
  background: var(--bg-surface);
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
  width: 100%;

  &:hover {
    transform: translateX(3px);
  }

  &.demo-admin {
    border-color: rgba(99, 102, 241, 0.3);
    color: #6366f1;
    &:hover {
      background: rgba(99, 102, 241, 0.08);
      border-color: #6366f1;
    }
  }
  &.demo-teacher {
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
    &:hover {
      background: rgba(16, 185, 129, 0.08);
      border-color: #10b981;
    }
  }
  &.demo-student {
    border-color: rgba(245, 158, 11, 0.3);
    color: #f59e0b;
    &:hover {
      background: rgba(245, 158, 11, 0.08);
      border-color: #f59e0b;
    }
  }
}
.demo-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.demo-role {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1;
}
.demo-cred {
  font-size: 0.75rem;
  opacity: 0.7;
  font-family: monospace;
}

/* ── Form ── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.pass-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.show-pass-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  align-self: flex-end;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: all 0.15s;
  &:hover {
    color: var(--primary);
    background: var(--primary-light);
  }
}

/* ── Error ── */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--danger-light);
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* ── Transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
