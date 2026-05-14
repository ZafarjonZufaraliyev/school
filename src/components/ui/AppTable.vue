<template>
  <div class="table-wrap">
    <div v-if="loading" class="table-loading">
      <div class="spinner-lg"></div>
    </div>
    <table v-else class="app-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="empty-row">
            <slot name="empty">Ma'lumot topilmadi</slot>
          </td>
        </tr>
        <tr v-for="(row, i) in rows" :key="row.id ?? i" @click="$emit('row-click', row)">
          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['row-click'])
</script>

<style scoped lang="scss">
.table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
thead tr {
  background: var(--bg-elevated);
}
th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
td {
  padding: 0.85rem 1rem;
  color: var(--text-primary);
  border-top: 1px solid var(--border-color);
}
tbody tr {
  transition: background 0.15s;
  &:hover {
    background: var(--bg-elevated);
    cursor: pointer;
  }
}
.empty-row {
  text-align: center;
  color: var(--text-muted);
  padding: 2.5rem;
}
.table-loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}
.spinner-lg {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
