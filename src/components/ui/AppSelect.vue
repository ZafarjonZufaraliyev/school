<template>
  <div class="field">
    <label v-if="label" class="field-label">{{ label }}</label>
    <select
      :value="modelValue"
      class="field-select"
      :class="{ 'has-error': error }"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Tanlang...' },
  options: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.field-select {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus {
    border-color: var(--border-focus);
  }
  &.has-error {
    border-color: var(--danger);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.field-error {
  font-size: 0.8rem;
  color: var(--danger);
}
</style>
