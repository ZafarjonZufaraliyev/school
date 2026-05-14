<template>
  <div>
    <div class="page-toolbar">
      <AppInput
        v-model="search"
        placeholder="Guruh qidirish..."
        :icon="Search"
        style="max-width: 280px"
      />
      <AppButton @click="showModal = true"><Plus :size="16" /> Guruh yaratish</AppButton>
    </div>

    <div class="groups-grid">
      <div v-if="store.isLoading">
        <AppSkeleton
          v-for="i in 6"
          :key="i"
          height="140px"
          radius="16px"
          style="margin-bottom: 1rem"
        />
      </div>
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="group-card"
        @click="router.push(`/admin/groups/${group.id}`)"
      >
        <div class="group-icon">{{ group.name[0] }}</div>
        <div class="group-info">
          <h3>{{ group.name }}</h3>
          <p>{{ group.students_count || 0 }} o'quvchi</p>
        </div>
        <div class="group-actions">
          <AppButton variant="secondary" size="sm" @click.stop="editGroup(group)"
            ><Pencil :size="14"
          /></AppButton>
          <AppButton variant="danger" size="sm" @click.stop="deleteGroup(group.id)"
            ><Trash2 :size="14"
          /></AppButton>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editing ? 'Guruhni tahrirlash' : 'Yangi guruh'">
      <form @submit.prevent="saveGroup">
        <AppInput v-model="form.name" label="Guruh nomi" placeholder="Masalan: G-101" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="saveGroup">Saqlash</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useGroupsStore } from '@/stores/groups.store'
import { useToast } from 'vue-toastification'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'

const store = useGroupsStore()
const router = useRouter()
const toast = useToast()

const search = ref('')
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = reactive({ name: '' })

const filteredGroups = computed(() =>
  store.groups.filter((g) => g.name.toLowerCase().includes(search.value.toLowerCase())),
)

function editGroup(g) {
  editing.value = g
  form.name = g.name
  showModal.value = true
}

async function saveGroup() {
  if (!form.name.trim()) return
  saving.value = true
  try {
    if (editing.value) {
      await store.updateGroup(editing.value.id, form)
      toast.success('Yangilandi')
    } else {
      await store.createGroup(form)
      toast.success('Guruh yaratildi')
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

async function deleteGroup(id) {
  if (!confirm("Guruhni o'chirishni tasdiqlaysizmi?")) return
  await store.deleteGroup(id)
  toast.success("O'chirildi")
}

onMounted(() => store.fetchGroups())
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
  box-shadow: var(--shadow-sm);
  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}
.group-icon {
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
.group-info {
  flex: 1;
  h3 {
    margin: 0 0 0.2rem;
    font-size: 1rem;
  }
  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.85rem;
  }
}
.group-actions {
  display: flex;
  gap: 0.4rem;
}
</style>
