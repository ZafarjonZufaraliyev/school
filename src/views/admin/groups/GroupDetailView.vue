<template>
  <div v-if="group" class="group-detail">
    <div class="detail-header">
      <div class="group-icon">{{ group.name[0] }}</div>
      <div>
        <h2>{{ group.name }}</h2>
        <p>{{ students.length }} o'quvchi · {{ group.subjects_count || 0 }} fan</p>
      </div>
    </div>
    <AppCard title="O'quvchilar ro'yxati">
      <AppTable :columns="cols" :rows="students">
        <template #cell-full_name="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <UserAvatar :name="row.full_name" :size="30" />
            <span>{{ row.full_name }}</span>
          </div>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupsStore } from '@/stores/groups.store'
import { mockGroupsService } from '@/services/mock.service'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const route = useRoute()
const groupsStore = useGroupsStore()
const group = computed(() => groupsStore.currentGroup)
const students = ref([])

const cols = [
  { key: 'full_name', label: 'Ism Familiya' },
  { key: 'username', label: 'Login' },
  { key: 'phone', label: 'Telefon' },
]

onMounted(async () => {
  await groupsStore.fetchGroup(route.params.id)
  const { data } = await mockGroupsService.getStudents(route.params.id)
  students.value = data
})
</script>

<style scoped lang="scss">
.group-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  h2 {
    margin: 0 0 0.25rem;
    font-size: 1.4rem;
  }
  p {
    margin: 0;
    color: var(--text-muted);
  }
}
.group-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
