<template>
  <div class="avatar" :style="{ width: sz, height: sz, background: bg, fontSize: fs }">
    <img v-if="src" :src="src" :alt="name" class="avatar-img" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getInitials, avatarColor } from '@/utils/helpers'

const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: '' },
  size: { type: Number, default: 40 },
})

const initials = computed(() => getInitials(props.name))
const bg = computed(() => avatarColor(props.name))
const sz = computed(() => `${props.size}px`)
const fs = computed(() => `${Math.round(props.size * 0.38)}px`)
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
