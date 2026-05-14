<template>
  <div v-if="user">
    <div class="detail-header">
      <UserAvatar :name="user.full_name" :size="72" />
      <div>
        <h2>{{ user.full_name }}</h2>
        <p>{{ user.username }} · {{ user.phone }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users.store'
import UserAvatar from '@/components/shared/UserAvatar.vue'
const route = useRoute()
const store = useUsersStore()
const user = computed(() => store.currentUser)
onMounted(() => store.fetchUser(route.params.id))
</script>
<style scoped lang="scss">
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
  }
  p {
    margin: 0;
    color: var(--text-muted);
  }
}
</style>
