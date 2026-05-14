<template>
  <div v-if="user" class="student-detail">
    <div class="detail-header">
      <UserAvatar :name="user.full_name" :size="72" />
      <div>
        <h2>{{ user.full_name }}</h2>
        <p>{{ user.username }} · {{ user.phone }}</p>
        <AppBadge variant="primary">{{ user.group?.name || "Guruh yo'q" }}</AppBadge>
      </div>
    </div>

    <div class="detail-grid">
      <AppCard title="Davomat">
        <ProgressRing :percent="attendancePercent" :size="120" label="Davomat" />
      </AppCard>
      <AppCard title="O'rtacha baho">
        <div class="big-number">{{ avgGrade || '—' }}</div>
      </AppCard>
    </div>
  </div>
  <div v-else class="loading-center">
    <AppSkeleton height="400px" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import ProgressRing from '@/components/charts/ProgressRing.vue'

const route = useRoute()
const store = useUsersStore()
const user = computed(() => store.currentUser)

const attendancePercent = ref(78)
const avgGrade = ref(84)

onMounted(() => store.fetchUser(route.params.id))
</script>

<style scoped lang="scss">
.student-detail {
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
    margin: 0 0 0.5rem;
    color: var(--text-muted);
  }
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.big-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary);
  text-align: center;
  padding: 1rem;
}
.loading-center {
  padding: 2rem;
}
</style>
