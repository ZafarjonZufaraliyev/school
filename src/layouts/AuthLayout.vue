<template>
  <div class="auth-layout">
    <!-- Left brand panel -->
    <div class="auth-brand">
      <div class="brand-content">
        <div class="brand-logo">E</div>
        <h1 class="brand-title">EduUz</h1>
        <p class="brand-desc">O'quv Markaz Boshqaruv Tizimi</p>

        <div class="brand-features">
          <div v-for="f in features" :key="f.text" class="feature-item">
            <div class="feature-icon">
              <component :is="f.icon" :size="16" />
            </div>
            <span>{{ f.text }}</span>
          </div>
        </div>

        <div class="brand-stats">
          <div v-for="s in stats" :key="s.label" class="brand-stat">
            <span class="stat-num">{{ s.num }}</span>
            <span class="stat-lbl">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="auth-form-side">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import {
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Bell,
  Users,
  BarChart3,
  Calendar,
} from 'lucide-vue-next'

const features = [
  { icon: ShieldCheck, text: "Admin, O'qituvchi, O'quvchi panellari" },
  { icon: GraduationCap, text: 'Davomat va baholash tizimi' },
  { icon: BookOpen, text: 'Topshiriqlar va resurslar' },
  { icon: Bell, text: 'Real-time bildirishnomalar' },
  { icon: BarChart3, text: 'Statistika va hisobotlar' },
  { icon: Calendar, text: 'Dars jadvali boshqaruvi' },
]

const stats = [
  { num: '500+', label: "O'quvchilar" },
  { num: '30+', label: "O'qituvchilar" },
  { num: '20+', label: 'Guruhlar' },
]
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  background: #0f172a;
}

/* ── Left brand panel ── */
.auth-brand {
  flex: 1;
  background: linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4338ca 75%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 3.5rem;
  position: relative;
  overflow: hidden;

  /* Decorative circles */
  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -100px;
    right: -100px;
  }
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: -80px;
    left: -80px;
  }

  @media (max-width: 900px) {
    display: none;
  }
}

.brand-content {
  color: #fff;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.brand-logo {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 1.75rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.brand-title {
  font-size: 2.75rem;
  font-weight: 900;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.brand-desc {
  font-size: 1.05rem;
  opacity: 0.75;
  margin: 0 0 2.25rem;
  line-height: 1.5;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.92rem;
  opacity: 0.88;
}

.feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-stats {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.brand-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-num {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1;
}

.stat-lbl {
  font-size: 0.78rem;
  opacity: 0.65;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Right form panel ── */
.auth-form-side {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-base);
  overflow-y: auto;

  @media (max-width: 900px) {
    width: 100%;
  }
}
</style>
