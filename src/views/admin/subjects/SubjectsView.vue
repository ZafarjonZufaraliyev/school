<template>
  <div>
    <div class="page-toolbar">
      <AppInput
        v-model="search"
        placeholder="Fan qidirish..."
        :icon="Search"
        style="max-width: 280px"
      />
      <AppButton @click="showModal = true"><Plus :size="16" /> Fan yaratish</AppButton>
    </div>
    <AppCard>
      <AppTable :columns="columns" :rows="filtered" :loading="store.isLoading">
        <template #cell-actions="{ row }">
          <AppButton variant="secondary" size="sm" @click="edit(row)"
            ><Pencil :size="14"
          /></AppButton>
          <AppButton variant="danger" size="sm" @click="del(row.id)"
            ><Trash2 :size="14"
          /></AppButton>
        </template>
      </AppTable>
    </AppCard>
    <AppModal v-model="showModal" :title="editing ? 'Tahrirlash' : 'Yangi fan'">
      <AppInput v-model="form.name" label="Fan nomi" placeholder="Masalan: Matematika" />
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="save">Saqlash</AppButton>
      </template>
    </AppModal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { Search, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useToast } from 'vue-toastification'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
const store = useSubjectsStore()
const toast = useToast()
const search = ref('')
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = reactive({ name: '' })
const columns = [
  { key: 'name', label: 'Fan nomi' },
  { key: 'actions', label: '', width: '120px' },
]
const filtered = computed(() =>
  store.subjects.filter((s) => s.name.toLowerCase().includes(search.value.toLowerCase())),
)
function edit(s) {
  editing.value = s
  form.name = s.name
  showModal.value = true
}
async function save() {
  saving.value = true
  try {
    if (editing.value) {
      await store.updateSubject(editing.value.id, form)
      toast.success('Yangilandi')
    } else {
      await store.createSubject(form)
      toast.success('Yaratildi')
    }
    showModal.value = false
    editing.value = null
    form.name = ''
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}
async function del(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return
  await store.deleteSubject(id)
  toast.success("O'chirildi")
}
onMounted(() => store.fetchSubjects())
</script>
<style scoped lang="scss">
.page-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
