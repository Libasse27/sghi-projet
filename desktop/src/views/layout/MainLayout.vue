<template>
  <a-layout class="main-layout">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="appStore.sidebarCollapsed"
      collapsible
      :width="250"
      theme="light"
      class="sidebar"
    >
      <div class="logo">
        <medicine-box-outlined v-if="!appStore.sidebarCollapsed" :style="{ fontSize: '32px' }" />
        <h2 v-if="!appStore.sidebarCollapsed">SGHI</h2>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <!-- Main Content -->
    <a-layout>
      <!-- Header -->
      <a-layout-header class="header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="appStore.sidebarCollapsed"
            class="trigger"
            @click="appStore.toggleSidebar"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="appStore.toggleSidebar"
          />

          <a-breadcrumb :items="breadcrumbItems" />
        </div>

        <div class="header-right">
          <!-- Notifications -->
          <a-badge :count="appStore.unreadNotifications" :offset="[-5, 5]">
            <bell-outlined class="header-icon" />
          </a-badge>

          <!-- User Menu -->
          <a-dropdown>
            <div class="user-info">
              <a-avatar :size="32" :style="{ backgroundColor: '#2C7A7B' }">
                {{ userInitials }}
              </a-avatar>
              <span class="user-name">{{ authStore.userFullName }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined />
                  Profil
                </a-menu-item>
                <a-menu-item key="settings">
                  <setting-outlined />
                  Paramètres
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  Déconnexion
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { h, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
  ExperimentOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();

const selectedKeys = ref([route.name]);

// Menu items
const menuItems = [
  {
    key: 'Dashboard',
    icon: () => h(DashboardOutlined),
    label: 'Tableau de bord',
    title: 'Tableau de bord',
  },
  {
    key: 'Patients',
    icon: () => h(UserOutlined),
    label: 'Patients',
    title: 'Patients',
  },
  {
    key: 'Consultations',
    icon: () => h(MedicineBoxOutlined),
    label: 'Consultations',
    title: 'Consultations',
  },
  {
    key: 'Emergency',
    icon: () => h(AlertOutlined),
    label: 'Urgences',
    title: 'Urgences',
  },
  {
    key: 'Laboratory',
    icon: () => h(ExperimentOutlined),
    label: 'Laboratoire',
    title: 'Laboratoire',
  },
  {
    type: 'divider',
  },
  {
    key: 'Settings',
    icon: () => h(SettingOutlined),
    label: 'Paramètres',
    title: 'Paramètres',
  },
];

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items = [];
  route.matched.forEach((record) => {
    if (record.meta?.title) {
      items.push({
        title: record.meta.title,
      });
    }
  });
  return items;
});

// User initials
const userInitials = computed(() => {
  const user = authStore.currentUser;
  if (!user) return 'U';
  return `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`.toUpperCase();
});

// Watch route changes
watch(
  () => route.name,
  (newName) => {
    selectedKeys.value = [newName];
  }
);

// Handle menu click
const handleMenuClick = ({ key }) => {
  router.push({ name: key });
};

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout();
    message.success('Déconnexion réussie');
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
}

.sidebar {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 64px;
    padding: 16px;
    color: #2C7A7B;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #2C7A7B;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .header-icon {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #2C7A7B;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .user-name {
        font-weight: 500;
      }
    }
  }
}

.content {
  margin: 24px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  overflow-y: auto;
}
</style>
