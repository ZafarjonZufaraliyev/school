<template>
  <div>
    <div class="filters">
      <AppSelect
        v-model="selectedType"
        :options="typeOptions"
        placeholder="Turi bo'yicha"
        style="min-width: 160px"
      />
    </div>

    <div v-if="store.isLoading" class="resources-grid">
      <AppSkeleton v-for="i in 6" :key="i" height="90px" radius="14px" />
    </div>

    <div v-else-if="filtered.length" class="resources-grid">
      <div v-for="r in filtered" :key="r.id" class="resource-card">
        <div class="res-icon" :class="r.type">
          <component :is="typeIcon(r.type)" :size="22" />
        </div>
        <div class="res-info">
          <h4>{{ r.title }}</h4>
          <span class="res-meta">{{ RESOURCE_TYPE_LABELS[r.type] }} · {{ r.subject?.name }}</span>
        </div>
        <a v-if="r.type === 'link'" :href="r.url" target="_blank" class="action-btn" title="Ochish">
          <ExternalLink :size="16" />
        </a>
        <button v-else class="action-btn" title="Yuklab olish" @click="download(r)">
          <Download :size="16" />
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <FolderOpen :size="48" style="opacity: 0.2; margin-bottom: 0.75rem" />
      <p>Resurs topilmadi</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FileText, Film, Link, File, Download, ExternalLink, FolderOpen } from 'lucide-vue-next'
import { useResourcesStore } from '@/stores/resources.store'
import { mockResourcesService } from '@/services/mock.service'
import { RESOURCE_TYPE_LABELS } from '@/utils/constants'
import { downloadBlob } from '@/utils/helpers'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'

const store = useResourcesStore()
const selectedType = ref('')

const typeOptions = [
  { value: '', label: 'Barchasi' },
  ...Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

const typeIcon = (t) =>
  ({ pdf: FileText, word: FileText, video: Film, link: Link, file: File })[t] || File

const filtered = computed(() =>
  selectedType.value
    ? store.resources.filter((r) => r.type === selectedType.value)
    : store.resources,
)

async function download(r) {
  try {
    const { data } = await mockResourcesService.download(r.id)
    downloadBlob(data, r.file_name || r.title)
  } catch {
    /* silent */
  }
}

onMounted(() => store.fetchResources())
</script>

<style scoped lang="scss">
.filters {
  margin-bottom: 1.25rem;
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
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
    transform: translateY(-1px);
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
  min-width: 0;
  h4 {
    margin: 0 0 0.2rem;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.res-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  flex-shrink: 0;
  &:hover {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }
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
    font-size: 1rem;
  }
}
</style>
