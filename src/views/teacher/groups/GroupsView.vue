<template>
  <div>
    <div class="groups-grid">
      <div
        v-for="g in groupsStore.groups"
        :key="g.id"
        class="group-card"
        @click="router.push(`/teacher/groups/${g.id}`)"
      >
        <div class="g-icon">{{ g.name[0] }}</div>
        <div class="g-info">
          <h3>{{ g.name }}</h3>
          <p>{{ g.students_count || 0 }} o'quvchi</p>
        </div>
        <ChevronRight :size="18" class="arrow" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import { useGroupsStore } from '@/stores/groups.store'
const groupsStore = useGroupsStore()
const router = useRouter()
onMounted(() => groupsStore.fetchGroups())
</script>
<style scoped lang="scss">
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.group-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}
.g-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.g-info {
  flex: 1;
  h3 {
    margin: 0 0 0.2rem;
  }
  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.85rem;
  }
}
.arrow {
  color: var(--text-muted);
}
</style>
