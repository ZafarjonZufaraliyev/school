<template>
  <div class="notif-wrap" ref="bellRef">
    <button class="icon-btn" @click="toggle">
      <Bell :size="20" />
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <Transition name="slide-up">
      <div v-if="open" class="notif-panel">
        <div class="notif-header">
          <span>Bildirishnomalar</span>
          <button v-if="unreadCount > 0" class="mark-all" @click="markAllAsRead">
            Barchasini o'qildi
          </button>
        </div>
        <div class="notif-list">
          <div v-if="!notifications.length" class="notif-empty">Bildirishnoma yo'q</div>
          <div
            v-for="n in notifications.slice(0, 8)"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.is_read }"
            @click="markAsRead(n.id)"
          >
            <div class="notif-dot" v-if="!n.is_read"></div>
            <div class="notif-content">
              <p class="notif-text">{{ n.message }}</p>
              <span class="notif-time">{{ fromNow(n.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications.store'
import { fromNow } from '@/utils/formatters'

const store = useNotificationsStore()
const { notifications, unreadCount } = storeToRefs(store)
const { markAsRead, markAllAsRead, fetchNotifications } = store

const open = ref(false)
const bellRef = ref(null)

function toggle() {
  open.value = !open.value
  if (open.value) fetchNotifications()
}

function onClickOutside(e) {
  if (bellRef.value && !bellRef.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped lang="scss">
.notif-wrap {
  position: relative;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.15s;
  &:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }
}
.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--danger);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}
.notif-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  z-index: 300;
  overflow: hidden;
}
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}
.mark-all {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
}
.notif-list {
  max-height: 360px;
  overflow-y: auto;
}
.notif-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: var(--bg-elevated);
  }
  &.unread {
    background: var(--primary-light);
  }
}
.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
  margin-top: 5px;
}
.notif-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin: 0 0 0.2rem;
}
.notif-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
