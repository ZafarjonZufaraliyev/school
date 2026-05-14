<template>
  <div class="profile-page">
    <!-- Profile card -->
    <div class="profile-card">
      <div class="profile-avatar">
        <UserAvatar :name="user?.full_name" :size="80" />
      </div>
      <div class="profile-info">
        <h2>{{ user?.full_name }}</h2>
        <p class="profile-username">@{{ user?.username }}</p>
        <AppBadge variant="primary">O'quvchi</AppBadge>
      </div>
    </div>

    <!-- Info section (read-only) -->
    <AppCard title="Shaxsiy ma'lumotlar">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">To'liq ism</span>
          <span class="info-value">{{ user?.full_name || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Telefon</span>
          <span class="info-value">{{ user?.phone || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Guruh</span>
          <span class="info-value">{{ user?.group?.name || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">{{ user?.email || '—' }}</span>
        </div>
      </div>
      <p class="info-note">
        <Info :size="14" />
        Shaxsiy ma'lumotlarni faqat admin o'zgartira oladi.
      </p>
    </AppCard>

    <!-- Change login -->
    <AppCard title="Loginni o'zgartirish">
      <form @submit.prevent="changeLogin" class="form-col">
        <AppInput
          v-model="loginForm.username"
          label="Yangi login"
          placeholder="Yangi username kiriting"
          :icon="User"
        />
        <AppInput
          v-model="loginForm.password"
          label="Joriy parol (tasdiqlash uchun)"
          type="password"
          placeholder="••••••"
          :icon="Lock"
        />
        <AppButton type="submit" :loading="savingLogin" style="align-self: flex-start">
          Loginni saqlash
        </AppButton>
      </form>
    </AppCard>

    <!-- Change password -->
    <AppCard title="Parolni o'zgartirish">
      <form @submit.prevent="changePassword" class="form-col">
        <AppInput
          v-model="passForm.old_password"
          label="Joriy parol"
          type="password"
          placeholder="••••••"
          :icon="Lock"
        />
        <AppInput
          v-model="passForm.new_password"
          label="Yangi parol"
          type="password"
          placeholder="••••••"
          :icon="Lock"
        />
        <AppInput
          v-model="passForm.confirm_password"
          label="Yangi parolni tasdiqlang"
          type="password"
          placeholder="••••••"
          :icon="Lock"
          :error="passError"
        />
        <AppButton type="submit" :loading="savingPass" style="align-self: flex-start">
          Parolni saqlash
        </AppButton>
      </form>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { User, Lock, Info } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)

// Login form
const loginForm = reactive({ username: '', password: '' })
const savingLogin = ref(false)

async function changeLogin() {
  if (!loginForm.username.trim()) return toast.warning('Yangi login kiriting')
  savingLogin.value = true
  try {
    await authStore.changeLogin(loginForm)
    toast.success("Login muvaffaqiyatli o'zgartirildi")
    loginForm.username = ''
    loginForm.password = ''
  } catch (e) {
    toast.error(e.response?.data?.detail || 'Xatolik yuz berdi')
  } finally {
    savingLogin.value = false
  }
}

// Password form
const passForm = reactive({ old_password: '', new_password: '', confirm_password: '' })
const passError = ref('')
const savingPass = ref(false)

async function changePassword() {
  passError.value = ''
  if (passForm.new_password !== passForm.confirm_password) {
    passError.value = 'Parollar mos kelmadi'
    return
  }
  if (passForm.new_password.length < 6) {
    passError.value = "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
    return
  }
  savingPass.value = true
  try {
    await authStore.changePassword({
      old_password: passForm.old_password,
      new_password: passForm.new_password,
    })
    toast.success("Parol muvaffaqiyatli o'zgartirildi")
    passForm.old_password = ''
    passForm.new_password = ''
    passForm.confirm_password = ''
  } catch (e) {
    toast.error(e.response?.data?.detail || "Joriy parol noto'g'ri")
  } finally {
    savingPass.value = false
  }
}
</script>

<style scoped lang="scss">
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 680px;
}
.profile-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
}
.profile-info {
  h2 {
    margin: 0 0 0.25rem;
    font-size: 1.4rem;
  }
}
.profile-username {
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1rem;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.info-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
}
.info-note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}
.form-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
