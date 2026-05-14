<template>
  <div>
    <div class="page-toolbar">
      <AppInput
        v-model="search"
        placeholder="Qidirish..."
        :icon="Search"
        style="max-width: 280px"
      />
      <AppButton @click="showModal = true"
        ><UserPlus :size="16" /> Foydalanuvchi qo'shish</AppButton
      >
    </div>
    <AppCard>
      <AppTable :columns="columns" :rows="filtered" :loading="store.isLoading">
        <template #cell-full_name="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <UserAvatar :name="row.full_name" :size="32" />
            <span>{{ row.full_name }}</span>
          </div>
        </template>
        <template #cell-role="{ value }">
          <AppBadge :variant="roleVariant(value)">{{ roleLabel(value) }}</AppBadge>
        </template>
        <template #cell-actions="{ row }">
          <AppButton variant="secondary" size="sm" @click.stop="edit(row)"
            ><Pencil :size="14"
          /></AppButton>
          <AppButton variant="danger" size="sm" @click.stop="del(row.id)"
            ><Trash2 :size="14"
          /></AppButton>
        </template>
      </AppTable>
    </AppCard>

    <AppModal v-model="showModal" :title="editing ? 'Tahrirlash' : 'Yangi foydalanuvchi'">
      <form class="form-grid">
        <AppInput v-model="form.full_name" label="To'liq ism" />
        <AppInput v-model="form.username" label="Login" />
        <AppInput v-model="form.password" label="Parol" type="password" />
        <AppInput v-model="form.phone" label="Telefon" />
        <AppSelect v-model="form.role" label="Rol" :options="roleOptions" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Bekor</AppButton>
        <AppButton :loading="saving" @click="save">Saqlash</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { Search, UserPlus, Pencil, Trash2 } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users.store'
import { useToast } from 'vue-toastification'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const store = useUsersStore()
const toast = useToast()
const search = ref('')
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = reactive({ full_name: '', username: '', password: '', phone: '', role: 'student' })

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: "O'qituvchi" },
  { value: 'student', label: "O'quvchi" },
]

const columns = [
  { key: 'full_name', label: 'Ism Familiya' },
  { key: 'username', label: 'Login' },
  { key: 'role', label: 'Rol' },
  { key: 'phone', label: 'Telefon' },
  { key: 'actions', label: '', width: '120px' },
]

const filtered = computed(() =>
  store.users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const roleLabel = (r) => ({ admin: 'Admin', teacher: "O'qituvchi", student: "O'quvchi" })[r] || r
const roleVariant = (r) =>
  ({ admin: 'danger', teacher: 'warning', student: 'primary' })[r] || 'default'

function edit(u) {
  editing.value = u
  Object.assign(form, {
    full_name: u.full_name,
    username: u.username,
    phone: u.phone,
    role: u.role,
    password: '',
  })
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    if (editing.value) {
      await store.updateUser(editing.value.id, form)
      toast.success('Yangilandi')
    } else {
      await store.createUser(form)
      toast.success("Qo'shildi")
    }
    showModal.value = false
    editing.value = null
  } catch {
    toast.error('Xatolik')
  } finally {
    saving.value = false
  }
}

async function del(id) {
  if (!confirm("O'chirishni tasdiqlaysizmi?")) return
  await store.deleteUser(id)
  toast.success("O'chirildi")
}

onMounted(() => store.fetchUsers())
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
