<template>
  <div class="ring-wrap" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90)"
        :transform-origin="`${size / 2} ${size / 2}`"
        style="transition: stroke-dashoffset 0.6s ease"
      />
    </svg>
    <div class="ring-label">
      <span class="ring-value">{{ Math.round(percent) }}%</span>
      <span v-if="label" class="ring-sub">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 100 },
  strokeWidth: { type: Number, default: 8 },
  color: { type: String, default: '#6366f1' },
  trackColor: { type: String, default: 'rgba(100,116,139,0.15)' },
  label: { type: String, default: '' },
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - Math.min(props.percent, 100) / 100))
</script>

<style scoped lang="scss">
.ring-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ring-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ring-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}
.ring-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
