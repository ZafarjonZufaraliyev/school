<template>
  <AppBadge :variant="variantMap[status] || 'default'">
    {{ ATTENDANCE_LABELS[status] || status }}
  </AppBadge>
</template>

<script setup>
import AppBadge from '@/components/ui/AppBadge.vue'
import { ATTENDANCE_LABELS } from '@/utils/constants'

defineProps({ status: { type: String, default: '' } })

const variantMap = {
  present: 'success',
  absent: 'danger',
  excused: 'warning',
}
</script>
