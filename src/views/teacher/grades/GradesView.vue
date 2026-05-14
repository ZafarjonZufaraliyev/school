<template>
  <div class="grades-page">
    <div class="filters">
      <AppSelect
        v-model="selectedGroup"
        :options="groupsStore.groupsOptions"
        placeholder="Guruh"
        style="min-width: 180px"
      />
      <AppSelect
        v-model="selectedSubject"
        :options="subjectsStore.subjectsOptions"
        placeholder="Fan"
        style="min-width: 180px"
      />
      <AppButton @click="load" :loading="loading">Yuklash</AppButton>
    </div>

    <AppCard v-if="students.length" title="Baholar kiritish">
      <AppTable :columns="columns" :rows="students">
        <template #cell-grade="{ row }">
          <input
            type="number"
            min="0"
            max="100"
            :value="grades[row.id]"
            class="grade-field"
            @change="grades[row.id] = Number($event.target.value)"
          />
        </template>
      </AppTable>
      <div class="save-row">
        <AppButton :loading="saving" @click="save">Saqlash</AppButton>
      </div>
    </AppCard>

    <div v-else-if="!loading" class="empty-hint">
      <p>Guruh va fanni tanlab, "Yuklash" tugmasini bosing</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGroupsStore } from '@/stores/groups.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useGradesStore } from '@/stores/grades.store'
import { useToast } from 'vue-toastification'
import { mockGroupsService } from '@/services/mock.service'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'

const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const gradesStore = useGradesStore()
const toast = useToast()

const selectedGroup = ref('')
const selectedSubject = ref('')
const students = ref([])
const grades = reactive({})
const loading = ref(false)
const saving = ref(false)

const columns = [
  { key: 'full_name', label: "O'quvchi" },
  { key: 'grade', label: 'Baho (0-100)' },
]

async function load() {
  if (!selectedGroup.value) return toast.warning('Guruh tanlang')
  loading.value = true
  try {
    const { data } = await mockGroupsService.getStudents(selectedGroup.value)
    students.value = data
    data.forEach((s) => {
      grades[s.id] = 0
    })
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await gradesStore.bulkSaveGrades({
      group_id: selectedGroup.value,
      subject_id: selectedSubject.value,
      grades: Object.entries(grades).map(([student_id, grade]) => ({ student_id, grade })),
    })
    toast.success('Baholar saqlandi')
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  groupsStore.fetchGroups()
  subjectsStore.fetchSubjects()
})
</script>

<style scoped lang="scss">
.grades-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.filters {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}
.grade-field {
  width: 80px;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  text-align: center;
  font-weight: 600;
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
}
.save-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.empty-hint {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}
</style>
