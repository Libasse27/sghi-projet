<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="section-title">Principal</h3>
        <router-link
          v-for="item in mainMenuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
          <span v-if="item.badge && !isCollapsed" class="badge">{{ item.badge }}</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h3 class="section-title">Patients</h3>
        <router-link
          v-for="item in patientMenuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h3 class="section-title">Services Médicaux</h3>
        <router-link
          v-for="item in medicalMenuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h3 class="section-title">Gestion</h3>
        <router-link
          v-for="item in managementMenuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button class="collapse-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  collapsed?: boolean;
}>();

const emit = defineEmits(['toggle']);

const isCollapsed = computed(() => props.collapsed || false);

const mainMenuItems = [
  { path: '/dashboard', icon: 'fas fa-home', label: 'Tableau de bord' },
  { path: '/emergency', icon: 'fas fa-ambulance', label: 'Urgences', badge: '3' },
  { path: '/appointments', icon: 'fas fa-calendar-alt', label: 'Rendez-vous' },
  { path: '/queue', icon: 'fas fa-users', label: 'File d\'attente' },
];

const patientMenuItems = [
  { path: '/patients', icon: 'fas fa-user-injured', label: 'Liste des Patients' },
  { path: '/patients/new', icon: 'fas fa-user-plus', label: 'Nouveau Patient' },
  { path: '/patients/search', icon: 'fas fa-search', label: 'Rechercher' },
];

const medicalMenuItems = [
  { path: '/consultations', icon: 'fas fa-stethoscope', label: 'Consultations' },
  { path: '/laboratory', icon: 'fas fa-flask', label: 'Laboratoire' },
  { path: '/imaging', icon: 'fas fa-x-ray', label: 'Imagerie' },
  { path: '/pharmacy', icon: 'fas fa-pills', label: 'Pharmacie' },
  { path: '/hospitalization', icon: 'fas fa-bed', label: 'Hospitalisation' },
  { path: '/surgery', icon: 'fas fa-procedures', label: 'Chirurgie' },
  { path: '/physiotherapy', icon: 'fas fa-walking', label: 'Kinésithérapie' },
];

const managementMenuItems = [
  { path: '/billing', icon: 'fas fa-file-invoice-dollar', label: 'Facturation' },
  { path: '/hr', icon: 'fas fa-user-tie', label: 'Ressources Humaines' },
  { path: '/statistics', icon: 'fas fa-chart-bar', label: 'Statistiques' },
  { path: '/reports', icon: 'fas fa-file-alt', label: 'Rapports' },
  { path: '/settings', icon: 'fas fa-cog', label: 'Paramètres' },
];

const toggleSidebar = () => {
  emit('toggle');
};
</script>

<style scoped lang="scss">
.app-sidebar {
  width: 260px;
  background: #1f2937;
  color: white;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;

  &.collapsed {
    width: 70px;

    .section-title {
      display: none;
    }

    .nav-item span:not(.badge) {
      display: none;
    }

    .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  padding: 8px 20px;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  font-size: 14px;

  i {
    width: 20px;
    font-size: 18px;
    text-align: center;
  }

  span:not(.badge) {
    flex: 1;
  }

  .badge {
    background: #ef4444;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: linear-gradient(90deg, #2563eb 0%, rgba(37, 99, 235, 0.8) 100%);
    color: white;
    border-left: 3px solid #60a5fa;
  }
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
}

.collapse-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
