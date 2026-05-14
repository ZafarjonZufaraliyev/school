<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})

defineEmits(['click'])

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  { 'btn-block': props.block, 'btn-loading': props.loading },
])
</script>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
}
.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  &:hover:not(:disabled) {
    background: var(--bg-surface);
  }
}
.btn-danger {
  background: var(--danger);
  color: #fff;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
}
.btn-success {
  background: var(--success);
  color: #fff;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
}
.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}
.btn-md {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
}
.btn-lg {
  padding: 0.8rem 1.6rem;
  font-size: 1.125rem;
}
.btn-block {
  width: 100%;
}
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
