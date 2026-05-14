<template>
  <div>
    <div class="page-toolbar">
      <AppButton @click="showModal = true"><Plus :size="16" /> Resurs qo'shish</AppButton>
    </div>

    <div v-if="store.isLoading" class="resources-grid">
      <AppSkeleton v-for="i in 6" :key="i" height="90px" radius="14px" />
    </div>

    <div v-else-if="store.resources.length" class="resources-grid">
      <div v-for="r in store.resources" :key="r.id" class="resource-card">
        <div class="res-icon" :class="r.type">
          <component :is="typeIcon(r.type)" :size="22" />
        </div>
        <div class="res-info">
          <h4>{{ r.title }}</h4>
          <span class="res-type">{{ RESOURCE_TYPE_LABELS[r.type] }}</span>
        </div>
        <AppButton variant="danger" size="sm" @click="del(r.id)">
          <Trash2 :size="14" />
        </AppButton>
      </div>
    </div>

    <div v-else class="empty-state">
      <FolderOpen :size="48" style="opacity: 0.2; margin-bottom: 0.75rem" />
      <p>Hali resurs qo'shilmagan</p>
    </div>

    <AppModal v-model="showModal" title="Yangi resurs">
      <form class="form-grid">
        <AppInput v-model="form.title" label="Sarlavha" style="grid-column: 1/-1" />
        <AppSelect v-model="form.type" label="Turi" :options="typeOptions" />
        <AppSelect v-model="form.subject_id" label="Fan" :options="subjectsStore.subjectsOptions" />
        <AppSelect v-model="form.group_id" label="Guruh" :options="groupsStore.groupsOptions" />
        <div v-if="form.type === 'link'" style="grid-column: 1/-1">
          <AppInput v-model="form.url" label="Havola URL" placeholder="https://..." />
        </div>
        <div v-else style="grid-column: 1/-1">
          <label class="field-label">Fayl</label>
          <input type="file" @change="onFile" class="file-input" />
        </div>
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="save">Yuklash</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Trash2, FileText, Film, Link, File, FolderOpen } from 'lucide-vue-next'
import { useResourcesStore } from '@/stores/resources.store'
import { useGroupsStore } from '@/stores/groups.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useToast } from 'vue-toastification'
import { RESOURCE_TYPE_LABELS } from '@/utils/constants'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'

const store = useResourcesStore()
const groupsStore = useGroupsStore()
const subjectsStore = useSubjectsStore()
const toast = useToast()

const showModal = ref(false)
const saving = ref(false)
const fileRef = ref(null)
const form = reactive({ title: '', type: 'pdf', subject_id: '', group_id: '', url: '' })

const typeOptions = Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label }))
const typeIcon = (t) =>
  ({ pdf: FileText, word: FileText, video: Film, link: Link, file: File })[t] || File

function onFile(e) {
  fileRef.value = e.target.files[0]
}

async function save() {
  if (!form.title.trim()) return toast.warning('Sarlavha kiriting')
  saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (fileRef.value) fd.append('file', fileRef.value)
    await store.createResource(fd)
    toast.success("Resurs qo'shildi")
    showModal.value = false
    Object.assign(form, { title: '', type: 'pdf', subject_id: '', group_id: '', url: '' })
    fileRef.value = null
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

async function del(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return
  await store.deleteResource(id)
  toast.success("O'chirildi")
}

onMounted(() => {
  store.fetchResources()
  groupsStore.fetchGroups()
  subjectsStore.fetchSubjects()
})
</script>

<style scoped lang="scss">
.page-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.resource-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
  }
}
.res-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &.pdf {
    background: #fee2e2;
    color: #ef4444;
  }
  &.word {
    background: #dbeafe;
    color: #3b82f6;
  }
  &.video {
    background: #fce7f3;
    color: #ec4899;
  }
  &.link {
    background: #d1fae5;
    color: #10b981;
  }
  &.file {
    background: var(--bg-elevated);
    color: var(--text-muted);
  }
}
.res-info {
  flex: 1;
  h4 {
    margin: 0 0 0.2rem;
    font-size: 0.9rem;
  }
}
.res-type {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 0.35rem;
}
.file-input {
  width: 100%;
  padding: 0.5rem;
  border: 1.5px dashed var(--border-color);
  border-radius: 10px;
  cursor: pointer;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-muted);
  text-align: center;
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
  p {
    margin: 0;
  }
}
</style>
