<template>
  <div class="settings-page">
    <h1 class="page-title">Sozlamalar</h1>

    <AppCard title="Kategoriyalar">
      <div class="cat-list">
        <div v-for="cat in categories" :key="cat.id" class="cat-item">
          <span class="cat-dot" :style="{ background: cat.color }"></span>
          <span class="cat-name">{{ cat.name }}</span>
          <code class="cat-slug">{{ cat.slug }}</code>
        </div>
      </div>
    </AppCard>

    <AppCard title="Kirish vaqti chegarasi">
      <div class="setting-row">
        <div>
          <p class="setting-label">Kech kelish chegarasi</p>
          <span class="setting-hint">Bu vaqtdan keyin kelganlar "Kech" deb belgilanadi</span>
        </div>
        <input type="time" v-model="lateThreshold" class="time-input" />
      </div>
      <button class="save-btn" @click="saveSettings">Saqlash</button>
    </AppCard>

    <AppCard title="Tizim haqida">
      <div class="info-list">
        <div class="info-row"><span>Versiya</span><code>1.0.0</code></div>
        <div class="info-row"><span>Backend</span><code>Laravel 12 + PostgreSQL</code></div>
        <div class="info-row"><span>Frontend</span><code>Vue 3 + Vite</code></div>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import { categoriesService } from '@/services'

const categories = ref([])
const lateThreshold = ref('08:15')

async function saveSettings() {
  alert('Sozlamalar saqlandi')
}

onMounted(async () => {
  const { data } = await categoriesService.getAll()
  categories.value = data
})
</script>

<style scoped lang="scss">
.settings-page { display: flex; flex-direction: column; gap: 1.25rem; max-width: 640px; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }

.cat-list { display: flex; flex-direction: column; gap: 0.5rem; }
.cat-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border-color); &:last-child { border-bottom: none; } }
.cat-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.cat-name { flex: 1; font-size: 0.9rem; color: var(--text-primary); }
.cat-slug { font-size: 0.78rem; background: var(--bg-elevated); padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--text-muted); }

.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.setting-label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.2rem; }
.setting-hint { font-size: 0.78rem; color: var(--text-muted); }
.time-input { padding: 0.5rem 0.85rem; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-base); color: var(--text-primary); font-size: 0.9rem; }
.save-btn { padding: 0.6rem 1.5rem; background: var(--primary); color: #fff; border: none; border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 600; }

.info-list { display: flex; flex-direction: column; gap: 0; }
.info-row { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 0; border-bottom: 1px solid var(--border-color); &:last-child { border-bottom: none; } span { font-size: 0.88rem; color: var(--text-muted); } code { font-size: 0.82rem; background: var(--bg-elevated); padding: 0.2rem 0.6rem; border-radius: 6px; } }
</style>
