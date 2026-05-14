<template>
  <div class="app-card">
    <div v-if="title || $slots.header" class="app-card__header">
      <slot name="header">
        <h3 class="app-card__title">{{ title }}</h3>
      </slot>
    </div>
    <div class="app-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '' } })
</script>

<style scoped lang="scss">
.app-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  &__header {
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }
  &__body {
    padding: 1.5rem;
  }
}
</style>
