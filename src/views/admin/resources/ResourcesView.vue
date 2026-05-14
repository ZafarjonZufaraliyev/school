<template>
  <div>
    <AppCard title="Barcha resurslar">
      <AppTable :columns="columns" :rows="store.resources" :loading="store.isLoading">
        <template #cell-type="{ value }">
          <AppBadge variant="info">{{ RESOURCE_TYPE_LABELS[value] || value }}</AppBadge>
        </template>
        <template #cell-actions="{ row }">
          <AppButton variant="danger" size="sm" @click="del(row.id)"
            ><Trash2 :size="14"
          /></AppButton>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useResourcesStore } from '@/stores/resources.store'
import { useToast } from 'vue-toastification'
import { RESOURCE_TYPE_LABELS } from '@/utils/constants'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
const store = useResourcesStore()
const toast = useToast()
const columns = [
  { key: 'title', label: 'Nomi' },
  { key: 'type', label: 'Turi' },
  { key: 'subject', label: 'Fan' },
  { key: 'actions', label: '', width: '80px' },
]
async function del(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return
  await store.deleteResource(id)
  toast.success("O'chirildi")
}
onMounted(() => store.fetchResources())
</script>
