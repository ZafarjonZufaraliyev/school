<template>
  <span class="badge" :class="`badge-${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  // primary | success | warning | danger | info | default
})
</script>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.65rem;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge-primary {
  background: var(--primary-light);
  color: var(--primary);
}
.badge-success {
  background: var(--success-light);
  color: var(--success);
}
.badge-warning {
  background: var(--warning-light);
  color: var(--warning);
}
.badge-danger {
  background: var(--danger-light);
  color: var(--danger);
}
.badge-info {
  background: var(--info-light);
  color: var(--info);
}
.badge-default {
  background: var(--bg-elevated);
  color: var(--text-secondary);
}
</style>
