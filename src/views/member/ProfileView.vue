<template>
  <div class="profile-page">
    <div class="profile-card">
      <UserAvatar :name="user?.full_name" :size="72" />
      <div class="profile-info">
        <h2 class="profile-name">{{ user?.full_name }}</h2>
        <p class="profile-class">{{ user?.class?.name }}</p>
        <AppBadge :variant="catVariant(user?.category?.slug)">
          {{ user?.category?.name }}
        </AppBadge>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Login</span>
        <span class="info-value">{{ user?.username }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Telefon</span>
        <span class="info-value">{{ user?.phone ?? '—' }}</span>
      </div>
      <div class="info-item" v-if="user?.parent_phone">
        <span class="info-label">Ota-ona telefoni</span>
        <span class="info-value">{{ user.parent_phone }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Rol</span>
        <span class="info-value">A'zo</span>
      </div>
    </div>

    <div class="password-section">
      <h3 class="section-title">Parolni o'zgartirish</h3>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label>Joriy parol</label>
          <input v-model="pwForm.current" type="password" class="form-input" />
        </div>
        <div class="form-group">
          <label>Yangi parol</label>
          <input v-model="pwForm.new" type="password" class="form-input" />
        </div>
        <div class="form-group">
          <label>Yangi parolni tasdiqlang</label>
          <input v-model="pwForm.confirm" type="password" class="form-input" />
        </div>
        <p v-if="pwError" class="form-error">{{ pwError }}</p>
        <p v-if="pwSuccess" class="form-success">{{ pwSuccess }}</p>
        <button type="submit" class="save-btn" :disabled="pwLoading">
          {{ pwLoading ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const catVariant = (s) => ({ student: 'primary', teacher: 'success', staff: 'warning' }[s] ?? 'default')

const pwForm = ref({ current: '', new: '', confirm: '' })
const pwLoading = ref(false)
const pwError = ref('')
const pwSuccess = ref('')

async function changePassword() {
  pwError.value = ''
  pwSuccess.value = ''
  if (pwForm.value.new !== pwForm.value.confirm) {
    pwError.value = 'Yangi parollar mos emas'
    return
  }
  if (pwForm.value.new.length < 6) {
    pwError.value = 'Parol kamida 6 ta belgi bo\'lishi kerak'
    return
  }
  pwLoading.value = true
  try {
    await authStore.changePassword({
      current_password: pwForm.value.current,
      new_password: pwForm.value.new,
      new_password_confirmation: pwForm.value.confirm,
    })
    pwSuccess.value = "Parol muvaffaqiyatli o'zgartirildi"
    pwForm.value = { current: '', new: '', confirm: '' }
  } catch {
    pwError.value = "Joriy parol noto'g'ri"
  } finally {
    pwLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.profile-page { max-width: 540px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
.profile-card {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 18px; padding: 1.5rem;
  display: flex; align-items: center; gap: 1.25rem;
}
.profile-name { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.25rem; }
.profile-class { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.5rem; }

.info-grid {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 14px; overflow: hidden;
}
.info-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  &:last-child { border-bottom: none; }
}
.info-label { font-size: 0.85rem; color: var(--text-muted); }
.info-value { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

.password-section {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 14px; padding: 1.25rem;
}
.section-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.85rem; label { font-size: 0.83rem; color: var(--text-secondary); } }
.form-input {
  padding: 0.6rem 0.9rem; border: 1px solid var(--border-color);
  border-radius: 10px; background: var(--bg-base);
  color: var(--text-primary); font-size: 0.9rem;
  &:focus { outline: none; border-color: var(--primary); }
}
.form-error { color: var(--danger); font-size: 0.82rem; margin: 0.25rem 0; }
.form-success { color: var(--success); font-size: 0.82rem; margin: 0.25rem 0; }
.save-btn {
  padding: 0.65rem 1.5rem; background: var(--primary); color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-size: 0.9rem; font-weight: 600;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
