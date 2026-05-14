<template>
  <div>
    <div class="assignments-grid">
      <div v-for="a in store.assignments" :key="a.id" class="assign-card">
        <div class="assign-header">
          <h3>{{ a.title }}</h3>
          <AppBadge :variant="a.upload_open ? 'success' : 'danger'">
            {{ a.upload_open ? 'Ochiq' : 'Yopiq' }}
          </AppBadge>
        </div>
        <p class="assign-desc">{{ a.description }}</p>
        <DeadlineTimer :deadline="a.deadline" />

        <div v-if="a.upload_open" class="upload-section">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            @change="(e) => onFile(a.id, e)"
            class="file-input"
          />
          <AppButton size="sm" :loading="uploading[a.id]" @click="submit(a.id)">
            Yuborish
          </AppButton>
        </div>
        <div v-else class="upload-closed"><Lock :size="14" /> Upload yopiq</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Lock } from 'lucide-vue-next'
import { useAssignmentsStore } from '@/stores/assignments.store'
import { useToast } from 'vue-toastification'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import DeadlineTimer from '@/components/shared/DeadlineTimer.vue'

const store = useAssignmentsStore()
const toast = useToast()
const files = reactive({})
const uploading = reactive({})

function onFile(id, e) {
  files[id] = e.target.files[0]
}

async function submit(id) {
  if (!files[id]) return toast.warning('Fayl tanlang')
  uploading[id] = true
  try {
    const fd = new FormData()
    fd.append('file', files[id])
    await store.submitAssignment(id, fd)
    toast.success('Topshiriq yuborildi')
    delete files[id]
  } catch {
    toast.error('Xatolik')
  } finally {
    uploading[id] = false
  }
}

onMounted(() => store.fetchAssignments())
</script>

<style scoped lang="scss">
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
}
.upload-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.file-input {
  flex: 1;
  padding: 0.4rem;
  border: 1.5px dashed var(--border-color);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}
.upload-closed {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
