<template>
  <DataTable
    :data="patients"
    :columns="columns"
    title="Liste des Patients"
    :loading="loading"
    :actions="actions"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    selectable
  >
    <template #actions>
      <button class="btn-primary" @click="$emit('add-patient')">
        <i class="fas fa-plus"></i>
        Nouveau Patient
      </button>
    </template>

    <template #cell-patientNumber="{ value }">
      <span class="patient-number">{{ value }}</span>
    </template>

    <template #cell-name="{ row }">
      <div class="patient-info">
        <div class="avatar">
          {{ row.firstName?.charAt(0) }}{{ row.lastName?.charAt(0) }}
        </div>
        <div>
          <div class="name">{{ row.firstName }} {{ row.lastName }}</div>
          <div class="meta">{{ row.phone }}</div>
        </div>
      </div>
    </template>

    <template #cell-age="{ row }">
      {{ calculateAge(row.dateNaissance) }} ans
    </template>

    <template #cell-gender="{ value }">
      <span class="badge" :class="value === 'M' ? 'badge-blue' : 'badge-pink'">
        {{ value === 'M' ? 'Masculin' : 'Féminin' }}
      </span>
    </template>

    <template #cell-bloodGroup="{ value }">
      <span v-if="value" class="blood-group">{{ value }}</span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell-lastVisit="{ value }">
      <span v-if="value" class="date">{{ formatDate(value) }}</span>
      <span v-else class="text-muted">Jamais</span>
    </template>

    <template #cell-status="{ value }">
      <span class="badge" :class="getStatusClass(value)">
        {{ getStatusLabel(value) }}
      </span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTable from './DataTable.vue';
import { differenceInYears, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateNaissance: string;
  gender: 'M' | 'F';
  phone: string;
  bloodGroup?: string;
  lastVisit?: string;
  status: string;
}

const props = defineProps<{
  patients: Patient[];
  loading?: boolean;
}>();

const emit = defineEmits(['add-patient', 'edit-patient', 'view-patient', 'delete-patient', 'row-click', 'selection-change']);

const columns = [
  { key: 'patientNumber', label: 'N° Patient', sortable: true },
  { key: 'name', label: 'Nom Complet', sortable: true },
  { key: 'age', label: 'Âge', sortable: true, align: 'center' as const },
  { key: 'gender', label: 'Sexe', sortable: true, align: 'center' as const },
  { key: 'bloodGroup', label: 'Groupe Sanguin', align: 'center' as const },
  { key: 'lastVisit', label: 'Dernière Visite', sortable: true },
  { key: 'status', label: 'Statut', sortable: true, align: 'center' as const },
];

const actions = [
  {
    label: 'Voir',
    icon: 'fas fa-eye',
    class: 'btn-view',
    handler: (row: Patient) => emit('view-patient', row),
  },
  {
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'btn-edit',
    handler: (row: Patient) => emit('edit-patient', row),
  },
  {
    label: 'Supprimer',
    icon: 'fas fa-trash-alt',
    class: 'btn-delete',
    handler: (row: Patient) => emit('delete-patient', row),
  },
];

const calculateAge = (dateOfBirth: string): number => {
  return differenceInYears(new Date(), new Date(dateOfBirth));
};

const formatDate = (date: string): string => {
  return format(new Date(date), 'dd MMM yyyy', { locale: fr });
};

const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-warning',
    DECEASED: 'badge-danger',
  };
  return statusClasses[status] || 'badge-secondary';
};

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    ACTIVE: 'Actif',
    INACTIVE: 'Inactif',
    DECEASED: 'Décédé',
  };
  return statusLabels[status] || status;
};

const handleRowClick = (row: Patient) => {
  emit('row-click', row);
};

const handleSelectionChange = (selected: any[]) => {
  emit('selection-change', selected);
};
</script>

<style scoped lang="scss">
.btn-primary {
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1d4ed8;
  }
}

.patient-number {
  font-family: monospace;
  font-weight: 600;
  color: #2563eb;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .name {
    font-weight: 500;
    color: #111827;
  }

  .meta {
    font-size: 12px;
    color: #6b7280;
  }
}

.blood-group {
  font-weight: 600;
  color: #dc2626;
}

.date {
  color: #6b7280;
}

.text-muted {
  color: #9ca3af;
  font-style: italic;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &.badge-blue {
    background: #dbeafe;
    color: #1e40af;
  }

  &.badge-pink {
    background: #fce7f3;
    color: #be185d;
  }

  &.badge-success {
    background: #d1fae5;
    color: #065f46;
  }

  &.badge-warning {
    background: #fef3c7;
    color: #92400e;
  }

  &.badge-danger {
    background: #fee2e2;
    color: #991b1b;
  }

  &.badge-secondary {
    background: #f3f4f6;
    color: #374151;
  }
}
</style>
