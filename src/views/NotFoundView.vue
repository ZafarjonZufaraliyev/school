<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <h1>Sahifa topilmadi</h1>
      <p>Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.</p>
      <AppButton @click="goBack"> <ArrowLeft :size="16" /> Orqaga qaytish </AppButton>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
}
.not-found-content {
  text-align: center;
  padding: 2rem;
}
.not-found-code {
  font-size: 8rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.15;
}
h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
}
p {
  color: var(--text-muted);
  margin: 0 0 2rem;
  font-size: 1rem;
}
</style>
