<template>
  <slot v-if="allowed" />
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps({
  roles: { type: Array, default: () => [] },
})

const authStore = useAuthStore()
const allowed = computed(() => props.roles.includes(authStore.userRole))
</script>
