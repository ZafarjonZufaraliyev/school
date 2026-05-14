<template>
  <div>
    <div class="page-toolbar">
      <AppInput
        v-model="search"
        placeholder="Qidirish..."
        :icon="Search"
        style="max-width: 280px"
      />
      <AppButton @click="showModal = true"><UserPlus :size="16" /> Qo'shish</AppButton>
    </div>
    <AppCard>
      <AppTable
        :columns="columns"
        :rows="filteredTeachers"
        :loading="store.isLoading"
        @row-click="goDetail"
      >
        <template #cell-full_name="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <UserAvatar :name="row.full_name" :size="32" />
            <span>{{ row.full_name }}</span>
          </div>
        </template>
        <template #cell-actions="{ row }">
          <AppButton variant="secondary" size="sm" @click.stop="editUser(row)"
            ><Pencil :size="14"
          /></AppButton>
          <AppButton variant="danger" size="sm" @click.stop="deleteUser(row.id)"
            ><Trash2 :size="14"
          /></AppButton>
        </template>
      </AppTable>
    </AppCard>

    <AppModal v-model="showModal" :title="editingUser ? 'Tahrirlash' : 'O\'qituvchi qo\'shish'">
      <form @submit.prevent="saveUser" class="form-grid">
        <AppInput v-model="form.full_name" label="To'liq ism" />
        <AppInput v-model="form.username" label="Login" />
        <AppInput v-model="form.password" label="Parol" type="password" />
        <AppInput v-model="form.phone" label="Telefon" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="saveUser">Saqlash</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Search, UserPlus, Pencil, Trash2 } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users.store'
import { useToast } from 'vue-toastification'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const store = useUsersStore()
const router = useRouter()
const toast = useToast()

const search = ref('')
const showModal = ref(false)
const saving = ref(false)
const editingUser = ref(null)
const form = reactive({ full_name: '', username: '', password: '', phone: '' })

const columns = [
  { key: 'full_name', label: 'Ism Familiya' },
  { key: 'username', label: 'Login' },
  { key: 'phone', label: 'Telefon' },
  { key: 'actions', label: '', width: '120px' },
]

const filteredTeachers = computed(() =>
  store.users.filter(
    (u) =>
      u.role === 'teacher' &&
      (u.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.value.toLowerCase())),
  ),
)

function goDetail(row) {
  router.push(`/admin/teachers/${row.id}`)
}
function editUser(user) {
  editingUser.value = user
  Object.assign(form, {
    full_name: user.full_name,
    username: user.username,
    phone: user.phone,
    password: '',
  })
  showModal.value = true
}
async function saveUser() {
  saving.value = true
  try {
    if (editingUser.value) {
      await store.updateUser(editingUser.value.id, form)
      toast.success('Yangilandi')
    } else {
      await store.createUser({ ...form, role: 'teacher' })
      toast.success("Qo'shildi")
    }
    showModal.value = false
    editingUser.value = null
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}
async function deleteUser(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return
  await store.deleteUser(id)
  toast.success("O'chirildi")
}
onMounted(() => store.fetchUsers({ role: 'teacher' }))
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
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
