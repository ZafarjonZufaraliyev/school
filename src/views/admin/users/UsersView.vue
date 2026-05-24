<template>
  <div class="users-page">
    <div class="page-header">
      <h1 class="page-title">Foydalanuvchilar</h1>
      <button class="add-btn" @click="showAddModal = true">
        <Plus :size="16" /> Qo'shish
      </button>
    </div>

    <div class="filter-bar">
      <button
        v-for="cat in categoryFilters"
        :key="cat.key"
        class="cat-btn"
        :class="{ active: activeCategory === cat.key }"
        @click="activeCategory = cat.key; load()"
      >{{ cat.label }}</button>
      <input v-model="search" placeholder="Qidirish..." class="search-input" />
    </div>

    <AppTable :columns="columns" :rows="filteredUsers" :loading="loading">
      <template #cell-user="{ row }">
        <div class="user-cell">
          <UserAvatar :name="row.full_name" :size="34" />
          <div>
            <p class="cell-name">{{ row.full_name }}</p>
            <span class="cell-sub">{{ row.username }}</span>
          </div>
        </div>
      </template>
      <template #cell-category="{ row }">
        <AppBadge :variant="catVariant(row.category?.slug)">{{ row.category?.name ?? '—' }}</AppBadge>
      </template>
      <template #cell-class="{ row }">{{ row.class?.name ?? '—' }}</template>
      <template #cell-role="{ row }">
        <AppBadge :variant="roleVariant(row.role)">{{ roleName(row.role) }}</AppBadge>
      </template>
      <template #cell-actions="{ row }">
        <div class="actions">
          <button class="icon-btn" @click="viewQr(row)" title="QR ko'rish">
            <QrCode :size="16" />
          </button>
          <button class="icon-btn danger" @click="confirmDelete(row)" title="O'chirish">
            <Trash2 :size="16" />
          </button>
        </div>
      </template>
    </AppTable>

    <!-- QR Modal -->
    <AppModal v-if="qrModal.visible" title="QR Kartasi" @close="qrModal.visible = false">
      <div class="qr-modal-body">
        <h3>{{ qrModal.user?.full_name }}</h3>
        <p class="qr-class">{{ qrModal.user?.class?.name }} · {{ qrModal.user?.category?.name }}</p>
        <div class="qr-pair">
          <div class="qr-mini checkin">
            <p>KIRISH (Oldingi tomon)</p>
            <vue-qrcode v-if="qrModal.qr_checkin" :value="qrModal.qr_checkin" :options="{ width: 160, margin: 2 }" />
          </div>
          <div class="qr-mini checkout">
            <p>CHIQISH (Orqa tomon)</p>
            <vue-qrcode v-if="qrModal.qr_checkout" :value="qrModal.qr_checkout" :options="{ width: 160, margin: 2 }" />
          </div>
        </div>
        <button class="regen-btn" @click="regenQr(qrModal.user)">
          <RefreshCw :size="14" /> QR ni yangilash
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, QrCode, Trash2, RefreshCw } from 'lucide-vue-next'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import AppTable from '@/components/ui/AppTable.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useUsersStore } from '@/stores/users.store'

const store = useUsersStore()
const loading = ref(true)
const search = ref('')
const activeCategory = ref('')
const showAddModal = ref(false)
const qrModal = ref({ visible: false, user: null, qr_checkin: '', qr_checkout: '' })

const categoryFilters = [
  { key: '', label: 'Hammasi' },
  { key: 'student', label: "O'quvchilar" },
  { key: 'teacher', label: "O'qituvchilar" },
  { key: 'staff', label: 'Xodimlar' },
]
const columns = [
  { key: 'user', label: 'Shaxs' },
  { key: 'category', label: 'Kategoriya' },
  { key: 'class', label: 'Sinf/Guruh' },
  { key: 'role', label: 'Rol' },
  { key: 'actions', label: '' },
]

const filteredUsers = computed(() =>
  search.value
    ? store.users.filter((u) => u.full_name.toLowerCase().includes(search.value.toLowerCase()))
    : store.users,
)

const catVariant = (s) => ({ student: 'primary', teacher: 'success', staff: 'warning' }[s] ?? 'default')
const roleVariant = (r) => ({ admin: 'danger', guard: 'warning', member: 'default' }[r] ?? 'default')
const roleName = (r) => ({ admin: 'Admin', guard: 'Navbatchi', member: "A'zo" }[r] ?? r)

async function load() {
  loading.value = true
  await store.fetchUsers({ category_slug: activeCategory.value || undefined })
  loading.value = false
}

async function viewQr(user) {
  const data = await store.getUserQr(user.id)
  qrModal.value = { visible: true, user, ...data }
}

async function regenQr(user) {
  const data = await store.regenerateQr(user.id)
  qrModal.value = { ...qrModal.value, ...data }
}

async function confirmDelete(user) {
  if (!confirm(`${user.full_name} ni o'chirasizmi?`)) return
  await store.deleteUser(user.id)
}

onMounted(load)
</script>

<style scoped lang="scss">
.users-page { display: flex; flex-direction: column; gap: 1.25rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0; }
.add-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.25rem; background: var(--primary); color: #fff;
  border: none; border-radius: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 600;
}
.filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.cat-btn {
  padding: 0.4rem 1rem; border-radius: 20px;
  border: 1px solid var(--border-color); background: var(--bg-surface);
  cursor: pointer; font-size: 0.82rem; color: var(--text-secondary); transition: all 0.15s;
  &.active { background: var(--primary); color: #fff; border-color: var(--primary); }
}
.search-input {
  margin-left: auto; padding: 0.45rem 0.9rem;
  border: 1px solid var(--border-color); border-radius: 10px;
  background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem;
  &:focus { outline: none; border-color: var(--primary); }
}
.user-cell { display: flex; align-items: center; gap: 0.65rem; }
.cell-name { font-weight: 600; font-size: 0.88rem; color: var(--text-primary); margin: 0 0 0.1rem; }
.cell-sub { font-size: 0.75rem; color: var(--text-muted); }
.actions { display: flex; gap: 0.4rem; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid var(--border-color); background: transparent;
  cursor: pointer; color: var(--text-muted);
  transition: all 0.15s;
  &:hover { border-color: var(--primary); color: var(--primary); }
  &.danger:hover { border-color: var(--danger); color: var(--danger); }
}
.qr-modal-body { text-align: center; h3 { margin: 0 0 0.25rem; font-size: 1.1rem; } }
.qr-class { font-size: 0.82rem; color: var(--text-muted); margin: 0 0 1rem; }
.qr-pair { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
.qr-mini {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 0.85rem; border-radius: 14px;
  &.checkin { border: 2px solid var(--success); }
  &.checkout { border: 2px solid var(--danger); }
  p { font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; margin: 0; }
  .checkin & p { color: var(--success); }
  .checkout & p { color: var(--danger); }
}
.regen-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1.25rem; border: 1px solid var(--border-color);
  border-radius: 8px; background: var(--bg-elevated); cursor: pointer;
  font-size: 0.82rem; color: var(--text-secondary);
  &:hover { border-color: var(--primary); color: var(--primary); }
}
</style>
