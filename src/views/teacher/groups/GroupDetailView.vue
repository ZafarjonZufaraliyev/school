<template>
  <div v-if="group" class="group-detail">
    <div class="detail-header">
      <div class="g-icon">{{ group.name[0] }}</div>
      <div>
        <h2>{{ group.name }}</h2>
        <p>{{ students.length }} o'quvchi</p>
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <AppCard v-if="activeTab === 'students'" title="O'quvchilar">
      <AppTable :columns="studentCols" :rows="students" />
    </AppCard>

    <AppCard v-if="activeTab === 'assignments'" title="Topshiriqlar">
      <AppTable :columns="assignCols" :rows="assignmentsStore.assignments">
        <template #cell-deadline="{ value }">{{ formatDate(value) }}</template>
        <template #cell-upload_open="{ value }">
          <AppBadge :variant="value ? 'success' : 'danger'">{{
            value ? 'Ochiq' : 'Yopiq'
          }}</AppBadge>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupsStore } from '@/stores/groups.store'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { mockGroupsService } from '@/services/mock.service'
import { formatDate } from '@/utils/formatters'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

const route = useRoute()
const groupsStore = useGroupsStore()
const assignmentsStore = useAssignmentsStore()

const group = computed(() => groupsStore.currentGroup)
const students = ref([])
const activeTab = ref('students')

const tabs = [
  { key: 'students', label: "O'quvchilar" },
  { key: 'assignments', label: 'Topshiriqlar' },
]
const studentCols = [
  { key: 'full_name', label: 'Ism Familiya' },
  { key: 'username', label: 'Login' },
  { key: 'phone', label: 'Telefon' },
]
const assignCols = [
  { key: 'title', label: 'Sarlavha' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'upload_open', label: 'Holat' },
]

onMounted(async () => {
  await groupsStore.fetchGroup(route.params.id)
  const { data } = await mockGroupsService.getStudents(route.params.id)
  students.value = data
  assignmentsStore.fetchAssignments({ group_id: route.params.id })
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
.g-icon {
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
.tabs {
  display: flex;
  gap: 0.5rem;
}
.tab-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }
  &:hover:not(.active) {
    border-color: var(--primary);
    color: var(--primary);
  }
}
</style>
