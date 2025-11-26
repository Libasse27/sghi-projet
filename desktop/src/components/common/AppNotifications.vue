<template>
  <transition name="slide-fade">
    <div v-if="isVisible" class="notifications-panel">
      <div class="panel-header">
        <h3>Notifications</h3>
        <div class="header-actions">
          <button v-if="unreadCount > 0" class="mark-all-read" @click="markAllAsRead">
            <i class="fas fa-check-double"></i>
            Tout marquer comme lu
          </button>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="panel-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <div class="notifications-list" ref="listContainer">
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <i class="fas fa-bell-slash"></i>
          <p>Aucune notification</p>
        </div>

        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{
            unread: !notification.read,
            [notification.type]: true,
          }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>

          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <div class="notification-meta">
              <span class="time">
                <i class="fas fa-clock"></i>
                {{ formatTime(notification.createdAt) }}
              </span>
              <span v-if="notification.priority === 'high'" class="priority">
                <i class="fas fa-exclamation-circle"></i>
                Priorité haute
              </span>
            </div>
          </div>

          <div class="notification-actions">
            <button
              v-if="!notification.read"
              class="action-btn"
              @click.stop="markAsRead(notification.id)"
              title="Marquer comme lu"
            >
              <i class="fas fa-check"></i>
            </button>
            <button
              class="action-btn"
              @click.stop="deleteNotification(notification.id)"
              title="Supprimer"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <button class="view-all-btn" @click="viewAllNotifications">
          Voir toutes les notifications
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['close']);

const router = useRouter();
const notificationStore = useNotificationStore();

const activeTab = ref('all');
const listContainer = ref<HTMLElement | null>(null);

const isVisible = computed(() => props.visible);
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const tabs = [
  { label: 'Toutes', value: 'all', count: notifications.value.length },
  { label: 'Non lues', value: 'unread', count: unreadCount.value },
  { label: 'Urgences', value: 'emergency', count: notifications.value.filter(n => n.type === 'emergency').length },
  { label: 'Système', value: 'system', count: notifications.value.filter(n => n.type === 'system').length },
];

const filteredNotifications = computed(() => {
  let filtered = notifications.value;

  switch (activeTab.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read);
      break;
    case 'emergency':
      filtered = filtered.filter(n => n.type === 'emergency');
      break;
    case 'system':
      filtered = filtered.filter(n => n.type === 'system');
      break;
  }

  return filtered.slice(0, 20); // Show max 20 notifications
});

const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    emergency: 'fas fa-ambulance',
    patient: 'fas fa-user-injured',
    appointment: 'fas fa-calendar-check',
    lab: 'fas fa-flask',
    pharmacy: 'fas fa-pills',
    billing: 'fas fa-file-invoice-dollar',
    system: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    success: 'fas fa-check-circle',
  };

  return icons[type] || 'fas fa-bell';
};

const formatTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

const handleNotificationClick = (notification: any) => {
  markAsRead(notification.id);

  // Navigate based on notification type
  if (notification.link) {
    router.push(notification.link);
    close();
  }
};

const markAsRead = async (id: string) => {
  await notificationStore.markAsRead(id);
};

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead();
};

const deleteNotification = async (id: string) => {
  await notificationStore.deleteNotification(id);
};

const viewAllNotifications = () => {
  router.push('/notifications');
  close();
};

const close = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.notifications-panel {
  position: fixed;
  top: 64px;
  right: 0;
  width: 420px;
  height: calc(100vh - 64px);
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mark-all-read {
    padding: 6px 12px;
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
      color: #374151;
    }

    i {
      margin-right: 6px;
    }
  }

  .close-btn {
    padding: 8px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.2s;

    &:hover {
      color: #374151;
    }
  }
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;

  .tab {
    flex: 1;
    padding: 12px 16px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    position: relative;

    &:hover {
      color: #374151;
    }

    &.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }

    .count {
      margin-left: 6px;
      padding: 2px 8px;
      background: #e5e7eb;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }

    &.active .count {
      background: #dbeafe;
      color: #2563eb;
    }
  }
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #9ca3af;

  i {
    font-size: 48px;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background: #f9fafb;
  }

  &.unread {
    background: #eff6ff;
    border-left-color: #2563eb;

    .notification-content h4 {
      font-weight: 600;
    }
  }

  &.emergency {
    border-left-color: #dc2626;
  }
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 18px;

  .emergency & {
    background: #fee2e2;
    color: #dc2626;
  }

  .success & {
    background: #d1fae5;
    color: #059669;
  }

  .warning & {
    background: #fef3c7;
    color: #d97706;
  }
}

.notification-content {
  flex: 1;
  min-width: 0;

  h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  p {
    margin: 0 0 8px;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }

  .notification-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #9ca3af;

    .time i,
    .priority i {
      margin-right: 4px;
    }

    .priority {
      color: #dc2626;
    }
  }
}

.notification-actions {
  display: flex;
  gap: 4px;
  align-items: flex-start;

  .action-btn {
    padding: 6px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: #374151;
    }
  }
}

.panel-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;

  .view-all-btn {
    width: 100%;
    padding: 10px;
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
