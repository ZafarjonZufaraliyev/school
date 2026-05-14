<template>
  <div v-if="assignment" class="detail">
    <div class="detail-header">
      <div>
        <h2>{{ assignment.title }}</h2>
        <p>{{ assignment.description }}</p>
        <DeadlineTimer :deadline="assignment.deadline" />
      </div>
      <AppButton :variant="assignment.upload_open ? 'danger' : 'success'" @click="toggle">
        {{ assignment.upload_open ? 'Uploadni yopish' : 'Uploadni ochish' }}
      </AppButton>
    </div>

    <AppCard title="Yuborilgan javoblar">
      <AppTable :columns="columns" :rows="store.submissions" :loading="loading">
        <template #cell-file="{ row }">
          <a :href="row.file_url" target="_blank" class="file-link">
            <FileText :size="14" /> {{ row.file_name }}
          </a>
        </template>
        <template #cell-grade="{ row }">
          <div class="grade-input">
            <input
              type="number"
              min="0"
              max="100"
              :value="row.grade"
              class="grade-field"
              @change="gradeSubmission(row.id, $event.target.value)"
            />
          </div>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { FileText } from 'lucide-vue-next'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useToast } from 'vue-toastification'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import DeadlineTimer from '@/components/shared/DeadlineTimer.vue'

const route = useRoute()
const store = useAssignmentsStore()
const toast = useToast()
const loading = ref(false)

const assignment = computed(() => store.currentAssignment)

const columns = [
  { key: 'student_name', label: "O'quvchi" },
  { key: 'file', label: 'Fayl' },
  { key: 'submitted_at', label: 'Yuborilgan vaqt' },
  { key: 'grade', label: 'Baho (0-100)' },
]

async function toggle() {
  await store.toggleUpload(assignment.value.id, !assignment.value.upload_open)
  toast.success(assignment.value.upload_open ? 'Yopildi' : 'Ochildi')
}

async function gradeSubmission(submissionId, grade) {
  await store.gradeSubmission(submissionId, { grade: Number(grade) })
  toast.success('Baho saqlandi')
}

onMounted(async () => {
  loading.value = true
  await store.fetchAssignment(route.params.id)
  await store.fetchSubmissions(route.params.id)
  loading.value = false
})
</script>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  h2 {
    margin: 0 0 0.25rem;
  }
  p {
    margin: 0 0 0.5rem;
    color: var(--text-muted);
  }
}
.file-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    text-decoration: underline;
  }
}
.grade-field {
  width: 70px;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  text-align: center;
  font-weight: 600;
}
</style>
