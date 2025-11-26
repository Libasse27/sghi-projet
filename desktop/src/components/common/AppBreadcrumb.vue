<template>
  <div class="breadcrumb-container">
    <nav class="breadcrumb">
      <router-link to="/dashboard" class="breadcrumb-item home">
        <i class="fas fa-home"></i>
        <span v-if="showLabels">Accueil</span>
      </router-link>

      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <span class="separator">
          <i class="fas fa-chevron-right"></i>
        </span>

        <router-link
          v-if="item.path && index < breadcrumbItems.length - 1"
          :to="item.path"
          class="breadcrumb-item"
        >
          <i v-if="item.icon" :class="item.icon"></i>
          {{ item.label }}
        </router-link>

        <span v-else class="breadcrumb-item current">
          <i v-if="item.icon" :class="item.icon"></i>
          {{ item.label }}
        </span>
      </template>
    </nav>

    <div v-if="showActions" class="breadcrumb-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

const props = defineProps<{
  items?: BreadcrumbItem[];
  showLabels?: boolean;
  showActions?: boolean;
}>();

const route = useRoute();

const breadcrumbItems = computed(() => {
  if (props.items && props.items.length > 0) {
    return props.items;
  }

  // Auto-generate breadcrumbs from route
  const paths = route.path.split('/').filter(p => p);
  const items: BreadcrumbItem[] = [];

  // Route label mapping
  const routeLabels: Record<string, { label: string; icon?: string }> = {
    dashboard: { label: 'Tableau de bord', icon: 'fas fa-chart-line' },
    patients: { label: 'Patients', icon: 'fas fa-user-injured' },
    consultations: { label: 'Consultations', icon: 'fas fa-stethoscope' },
    appointments: { label: 'Rendez-vous', icon: 'fas fa-calendar-check' },
    emergency: { label: 'Urgences', icon: 'fas fa-ambulance' },
    laboratory: { label: 'Laboratoire', icon: 'fas fa-flask' },
    imaging: { label: 'Imagerie', icon: 'fas fa-x-ray' },
    pharmacy: { label: 'Pharmacie', icon: 'fas fa-pills' },
    hospitalisation: { label: 'Hospitalisation', icon: 'fas fa-bed' },
    physiotherapy: { label: 'Kinésithérapie', icon: 'fas fa-dumbbell' },
    surgery: { label: 'Chirurgie', icon: 'fas fa-user-md' },
    billing: { label: 'Facturation', icon: 'fas fa-file-invoice-dollar' },
    hr: { label: 'Ressources Humaines', icon: 'fas fa-users' },
    statistics: { label: 'Statistiques', icon: 'fas fa-chart-bar' },
    notifications: { label: 'Notifications', icon: 'fas fa-bell' },
    settings: { label: 'Paramètres', icon: 'fas fa-cog' },
    new: { label: 'Nouveau', icon: 'fas fa-plus' },
    edit: { label: 'Modifier', icon: 'fas fa-edit' },
    view: { label: 'Détails', icon: 'fas fa-eye' },
  };

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;

    // Try to get label from route meta or mapping
    const routeMeta = route.matched[index + 1]?.meta;
    const label = routeMeta?.breadcrumb as string ||
                  routeLabels[path]?.label ||
                  path.charAt(0).toUpperCase() + path.slice(1);

    const icon = routeMeta?.breadcrumbIcon as string || routeLabels[path]?.icon;

    items.push({
      label,
      path: index < paths.length - 1 ? currentPath : undefined,
      icon,
    });
  });

  return items;
});
</script>

<style scoped lang="scss">
.breadcrumb-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    color: #6b7280;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s;

    &.home {
      color: #2563eb;

      &:hover {
        background: #eff6ff;
      }

      i {
        font-size: 16px;
      }
    }

    &:not(.current):not(.home):hover {
      color: #374151;
      background: #f3f4f6;
    }

    &.current {
      color: #111827;
      font-weight: 600;
      cursor: default;
    }

    i {
      font-size: 14px;
    }
  }

  .separator {
    color: #d1d5db;
    font-size: 10px;

    i {
      font-size: 10px;
    }
  }
}

.breadcrumb-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Responsive
@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 8px 16px;
  }

  .breadcrumb {
    .breadcrumb-item {
      padding: 4px 8px;
      font-size: 12px;

      span:not(.separator) {
        display: none;
      }

      &.home span {
        display: none;
      }

      i {
        font-size: 12px;
      }
    }
  }
}
</style>
