import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  timestamp: string;
}

interface AppState {
  isLoading: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  isLoading: false,
  notifications: [],
  theme: 'light',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        ...action.payload,
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: state => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setLoading,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setTheme,
} = appSlice.actions;

export default appSlice.reducer;
