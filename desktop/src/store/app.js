import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    isDarkMode: false,
    notifications: [],
    loading: false,
  }),

  getters: {
    unreadNotifications: (state) =>
      state.notifications.filter((n) => !n.read).length,
  },

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },

    addNotification(notification) {
      this.notifications.unshift({
        id: Date.now(),
        read: false,
        timestamp: new Date(),
        ...notification,
      });
    },

    markNotificationAsRead(id) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach((n) => {
        n.read = true;
      });
    },

    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    setLoading(value) {
      this.loading = value;
    },
  },

  persist: {
    key: 'sghi-app',
    storage: localStorage,
    paths: ['sidebarCollapsed', 'isDarkMode'],
  },
});
