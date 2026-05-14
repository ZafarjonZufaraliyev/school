<template>
  <div class="field">
    <label v-if="label" :for="id" class="field-label">{{ label }}</label>
    <div class="field-wrap" :class="{ 'has-error': error }">
      <component :is="icon" v-if="icon" class="field-icon" :size="18" />
      <input
        :id="id"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="field-input"
        :class="{ 'with-icon': icon }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2)}` },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  icon: { type: [Object, Function], default: null },
})
defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })
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
.field-wrap {
  position: relative;
  &.has-error .field-input {
    border-color: var(--danger);
  }
}
.field-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
.field-input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  &.with-icon {
    padding-left: 2.5rem;
  }
  &:focus {
    border-color: var(--border-focus);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &::placeholder {
    color: var(--text-muted);
  }
}
.field-error {
  font-size: 0.8rem;
  color: var(--danger);
}
</style>
