<template>
  <span v-if="info" class="deadline" :class="{ expired: info.expired }">
    <Clock :size="14" />
    {{ info.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { timeLeft } from '@/utils/formatters'

const props = defineProps({ deadline: { type: String, default: null } })
const info = computed(() => timeLeft(props.deadline))
</script>

<style scoped lang="scss">
.deadline {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--warning);
  &.expired {
    color: var(--danger);
  }
}
</style>
