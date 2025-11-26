<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="logo">
        <i class="fas fa-hospital"></i>
        <span>SGHI</span>
      </div>
    </div>

    <div class="header-center">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input
          type="text"
          placeholder="Rechercher un patient, consultation..."
          v-model="searchQuery"
          @input="handleSearch"
        />
      </div>
    </div>

    <div class="header-right">
      <!-- Notifications -->
      <button class="header-btn" @click="showNotifications">
        <i class="fas fa-bell"></i>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>

      <!-- Messages -->
      <button class="header-btn">
        <i class="fas fa-envelope"></i>
        <span v-if="unreadMessages > 0" class="badge">{{ unreadMessages }}</span>
      </button>

      <!-- Quick Actions -->
      <div class="dropdown">
        <button class="header-btn">
          <i class="fas fa-plus-circle"></i>
        </button>
        <div class="dropdown-menu">
          <a href="#" @click.prevent="quickAction('patient')">
            <i class="fas fa-user-plus"></i> Nouveau Patient
          </a>
          <a href="#" @click.prevent="quickAction('consultation')">
            <i class="fas fa-stethoscope"></i> Nouvelle Consultation
          </a>
          <a href="#" @click.prevent="quickAction('appointment')">
            <i class="fas fa-calendar-plus"></i> Nouveau Rendez-vous
          </a>
        </div>
      </div>

      <!-- User Profile -->
      <div class="user-profile dropdown">
        <button class="profile-btn">
          <img :src="user?.avatar || defaultAvatar" :alt="user?.name" />
          <span class="user-name">{{ user?.name }}</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">
          <div class="profile-info">
            <div class="avatar-large">
              <img :src="user?.avatar || defaultAvatar" :alt="user?.name" />
            </div>
            <h4>{{ user?.name }}</h4>
            <p class="role">{{ user?.role }}</p>
          </div>
          <div class="divider"></div>
          <a href="#" @click.prevent="goToProfile">
            <i class="fas fa-user"></i> Mon Profil
          </a>
          <a href="#" @click.prevent="goToSettings">
            <i class="fas fa-cog"></i> Paramètres
          </a>
          <div class="divider"></div>
          <a href="#" @click.prevent="logout" class="logout">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notifications';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const searchQuery = ref('');
const defaultAvatar = '/assets/default-avatar.png';

const user = computed(() => authStore.user);
const unreadCount = computed(() => notificationStore.unreadCount);
const unreadMessages = ref(0); // TODO: Implement messages store

const emit = defineEmits(['toggle-sidebar', 'show-notifications', 'search']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const showNotifications = () => {
  emit('show-notifications');
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const quickAction = (type: string) => {
  switch (type) {
    case 'patient':
      router.push('/patients/new');
      break;
    case 'consultation':
      router.push('/consultations/new');
      break;
    case 'appointment':
      router.push('/appointments/new');
      break;
  }
};

const goToProfile = () => {
  router.push('/profile');
};

const goToSettings = () => {
  router.push('/settings');
};

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped lang="scss">
.app-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;

  i {
    font-size: 28px;
  }
}

.header-center {
  flex: 1;
  max-width: 600px;
  margin: 0 32px;
}

.search-bar {
  position: relative;
  width: 100%;

  i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  input {
    width: 100%;
    padding: 10px 16px 10px 44px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  position: relative;
  background: none;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
}

.dropdown {
  position: relative;

  &:hover .dropdown-menu {
    display: block;
  }
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  z-index: 1000;

  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #374151;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background: #f3f4f6;
    }

    &.logout {
      color: #ef4444;
    }

    i {
      width: 20px;
      font-size: 16px;
    }
  }
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 6px 12px 6px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  i {
    font-size: 12px;
    color: #9ca3af;
  }
}

.profile-info {
  padding: 20px;
  text-align: center;

  .avatar-large img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-bottom: 12px;
  }

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  .role {
    margin: 4px 0 0;
    font-size: 13px;
    color: #6b7280;
  }
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}
</style>
