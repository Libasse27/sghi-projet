<template>
  <DataTable
    :data="appointments"
    :columns="columns"
    title="Rendez-vous"
    :loading="loading"
    :actions="actions"
    @row-click="handleRowClick"
  >
    <template #actions>
      <button class="btn-primary" @click="$emit('add-appointment')">
        <i class="fas fa-plus"></i>
        Nouveau Rendez-vous
      </button>
    </template>

    <template #filters>
      <select v-model="statusFilter" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="SCHEDULED">Programmé</option>
        <option value="CONFIRMED">Confirmé</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="COMPLETED">Terminé</option>
        <option value="CANCELLED">Annulé</option>
      </select>

      <select v-model="typeFilter" class="filter-select">
        <option value="">Tous les types</option>
        <option value="GENERAL">Consultation Générale</option>
        <option value="SPECIALIST">Spécialisée</option>
        <option value="FOLLOWUP">Suivi</option>
      </select>
    </template>

    <template #cell-appointmentNumber="{ value }">
      <span class="appointment-number">{{ value }}</span>
    </template>

    <template #cell-patient="{ row }">
      <div class="patient-info">
        <div class="name">{{ row.patient?.firstName }} {{ row.patient?.lastName }}</div>
        <div class="meta">{{ row.patient?.patientNumber }}</div>
      </div>
    </template>

    <template #cell-doctor="{ row }">
      <div class="doctor-info">
        <div class="name">Dr. {{ row.doctor?.firstName }} {{ row.doctor?.lastName }}</div>
        <div class="meta">{{ row.doctor?.specialty }}</div>
      </div>
    </template>

    <template #cell-dateTime="{ value }">
      <div class="datetime">
        <div class="date">{{ formatDate(value) }}</div>
        <div class="time">{{ formatTime(value) }}</div>
      </div>
    </template>

    <template #cell-type="{ value }">
      <span class="badge" :class="getTypeClass(value)">
        {{ getTypeLabel(value) }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <span class="badge" :class="getStatusClass(value)">
        {{ getStatusLabel(value) }}
      </span>
    </template>

    <template #cell-duration="{ value }">
      {{ value }} min
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DataTable from './DataTable.vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Appointment {
  id: string;
  appointmentNumber: string;
  patient: {
    firstName: string;
    lastName: string;
    patientNumber: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
  dateTime: string;
  duration: number;
  type: string;
  status: string;
  reason?: string;
}

const props = defineProps<{
  appointments: Appointment[];
  loading?: boolean;
}>();

const emit = defineEmits(['add-appointment', 'edit-appointment', 'view-appointment', 'cancel-appointment', 'row-click']);

const statusFilter = ref('');
const typeFilter = ref('');

const columns = [
  { key: 'appointmentNumber', label: 'N° RDV', sortable: true },
  { key: 'patient', label: 'Patient', sortable: true },
  { key: 'doctor', label: 'Médecin', sortable: true },
  { key: 'dateTime', label: 'Date & Heure', sortable: true },
  { key: 'duration', label: 'Durée', align: 'center' as const },
  { key: 'type', label: 'Type', align: 'center' as const },
  { key: 'status', label: 'Statut', sortable: true, align: 'center' as const },
];

const actions = computed(() => [
  {
    label: 'Voir',
    icon: 'fas fa-eye',
    class: 'btn-view',
    handler: (row: Appointment) => emit('view-appointment', row),
  },
  {
    label: 'Modifier',
    icon: 'fas fa-edit',
    class: 'btn-edit',
    handler: (row: Appointment) => emit('edit-appointment', row),
  },
  {
    label: 'Annuler',
    icon: 'fas fa-times-circle',
    class: 'btn-cancel',
    handler: (row: Appointment) => emit('cancel-appointment', row),
  },
]);

const formatDate = (dateTime: string): string => {
  return format(new Date(dateTime), 'dd MMM yyyy', { locale: fr });
};

const formatTime = (dateTime: string): string => {
  return format(new Date(dateTime), 'HH:mm', { locale: fr });
};

const getTypeClass = (type: string): string => {
  const typeClasses: Record<string, string> = {
    GENERAL: 'badge-blue',
    SPECIALIST: 'badge-purple',
    FOLLOWUP: 'badge-teal',
  };
  return typeClasses[type] || 'badge-secondary';
};

const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    GENERAL: 'Générale',
    SPECIALIST: 'Spécialisée',
    FOLLOWUP: 'Suivi',
  };
  return typeLabels[type] || type;
};

const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    SCHEDULED: 'badge-info',
    CONFIRMED: 'badge-success',
    IN_PROGRESS: 'badge-warning',
    COMPLETED: 'badge-secondary',
    CANCELLED: 'badge-danger',
  };
  return statusClasses[status] || 'badge-secondary';
};

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    SCHEDULED: 'Programmé',
    CONFIRMED: 'Confirmé',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
  };
  return statusLabels[status] || status;
};

const handleRowClick = (row: Appointment) => {
  emit('row-click', row);
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

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
}

.appointment-number {
  font-family: monospace;
  font-weight: 600;
  color: #2563eb;
}

.patient-info,
.doctor-info {
  .name {
    font-weight: 500;
    color: #111827;
  }

  .meta {
    font-size: 12px;
    color: #6b7280;
  }
}

.datetime {
  .date {
    font-weight: 500;
    color: #111827;
  }

  .time {
    font-size: 12px;
    color: #6b7280;
  }
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

  &.badge-purple {
    background: #ede9fe;
    color: #6b21a8;
  }

  &.badge-teal {
    background: #ccfbf1;
    color: #115e59;
  }

  &.badge-info {
    background: #e0e7ff;
    color: #3730a3;
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
