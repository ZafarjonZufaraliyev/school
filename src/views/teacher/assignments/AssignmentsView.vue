<template>
  <div>
    <div class="page-toolbar">
      <AppSelect
        v-model="selectedGroup"
        :options="groupsStore.groupsOptions"
        placeholder="Guruh"
        style="min-width: 180px"
      />
      <AppButton @click="showModal = true"><Plus :size="16" /> Topshiriq yaratish</AppButton>
    </div>

    <div class="assignments-grid">
      <div v-for="a in store.assignments" :key="a.id" class="assign-card">
        <div class="assign-header">
          <h3>{{ a.title }}</h3>
          <AppBadge :variant="a.upload_open ? 'success' : 'danger'">
            {{ a.upload_open ? 'Ochiq' : 'Yopiq' }}
          </AppBadge>
        </div>
        <p class="assign-desc">{{ a.description }}</p>
        <div class="assign-footer">
          <DeadlineTimer :deadline="a.deadline" />
          <div class="assign-actions">
            <AppButton variant="secondary" size="sm" @click="toggleUpload(a)">
              {{ a.upload_open ? 'Yopish' : 'Ochish' }}
            </AppButton>
            <AppButton size="sm" @click="viewSubmissions(a)">
              Javoblar ({{ a.submissions_count || 0 }})
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" title="Yangi topshiriq">
      <form class="form-grid">
        <AppInput v-model="form.title" label="Sarlavha" style="grid-column: 1/-1" />
        <AppInput v-model="form.description" label="Tavsif" style="grid-column: 1/-1" />
        <AppSelect v-model="form.group_id" label="Guruh" :options="groupsStore.groupsOptions" />
        <AppSelect v-model="form.subject_id" label="Fan" :options="subjectsStore.subjectsOptions" />
        <AppInput v-model="form.deadline" label="Deadline" type="datetime-local" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="save">Yaratish</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useGroupsStore } from '@/stores/groups.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useToast } from 'vue-toastification'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import DeadlineTimer from '@/components/shared/DeadlineTimer.vue'

const store = useAssignmentsStore()
const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const router = useRouter()
const toast = useToast()

const selectedGroup = ref('')
const showModal = ref(false)
const saving = ref(false)
const form = reactive({ title: '', description: '', group_id: '', subject_id: '', deadline: '' })

watch(selectedGroup, (v) => store.fetchAssignments({ group_id: v }))

async function save() {
  saving.value = true
  try {
    await store.createAssignment(form)
    toast.success('Topshiriq yaratildi')
    showModal.value = false
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

async function toggleUpload(a) {
  await store.toggleUpload(a.id, !a.upload_open)
  toast.success(a.upload_open ? 'Yopildi' : 'Ochildi')
}

function viewSubmissions(a) {
  router.push(`/teacher/assignments/${a.id}`)
}

onMounted(() => {
  store.fetchAssignments()
  groupsStore.fetchGroups()
  subjectsStore.fetchSubjects()
})
</script>

<style scoped lang="scss">
.page-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}
.assign-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: var(--shadow-sm);
}
.assign-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  h3 {
    margin: 0;
    font-size: 1rem;
  }
}
.assign-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}
.assign-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.assign-actions {
  display: flex;
  gap: 0.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
