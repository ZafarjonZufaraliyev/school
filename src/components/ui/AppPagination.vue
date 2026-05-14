<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="pg-btn" :disabled="page <= 1" @click="$emit('change', page - 1)">
      <ChevronLeft :size="16" />
    </button>
    <button
      v-for="p in pages"
      :key="p"
      class="pg-btn"
      :class="{ active: p === page, dots: p === '...' }"
      :disabled="p === '...'"
      @click="p !== '...' && $emit('change', p)"
    >
      {{ p }}
    </button>
    <button class="pg-btn" :disabled="page >= totalPages" @click="$emit('change', page + 1)">
      <ChevronRight :size="16" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})
defineEmits(['change'])

const pages = computed(() => {
  const total = props.totalPages
  const cur = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const arr = [1]
  if (cur > 3) arr.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) arr.push(i)
  if (cur < total - 2) arr.push('...')
  arr.push(total)
  return arr
})
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.pg-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  &:hover:not(:disabled):not(.dots) {
    border-color: var(--primary);
    color: var(--primary);
  }
  &.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &.dots {
    border: none;
    background: none;
    cursor: default;
  }
}
</style>
