<template>
  <div class="consultations-list">
    <a-page-header title="Consultations">
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/consultations/calendar')">
            <template #icon><calendar-outlined /></template>
            Calendrier
          </a-button>
          <a-button type="primary" @click="$router.push('/consultations/create')">
            <template #icon><plus-outlined /></template>
            Nouvelle Consultation
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="list-content">
      <!-- Filtres -->
      <a-card class="filters-card">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              v-model:value="filters.search"
              placeholder="Patient, médecin..."
              style="width: 250px"
              @change="handleFilter"
            >
              <template #prefix><search-outlined /></template>
            </a-input>
          </a-form-item>

          <a-form-item label="Statut">
            <a-select v-model:value="filters.status" style="width: 150px" @change="handleFilter">
              <a-select-option value="">Tous</a-select-option>
              <a-select-option value="scheduled">Planifiée</a-select-option>
              <a-select-option value="in_progress">En Cours</a-select-option>
              <a-select-option value="completed">Terminée</a-select-option>
              <a-select-option value="cancelled">Annulée</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Date">
            <a-range-picker
              v-model:value="filters.dateRange"
              format="DD/MM/YYYY"
              @change="handleFilter"
            />
          </a-form-item>

          <a-form-item>
            <a-button @click="resetFilters">Réinitialiser</a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Table -->
      <a-card>
        <a-table
          :columns="columns"
          :data-source="filteredConsultations"
          :pagination="pagination"
          :loading="loading"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'patient'">
              <a @click="viewPatient(record.patientId)">
                {{ record.patientNom }} {{ record.patientPrenom }}
              </a>
            </template>

            <template v-else-if="column.key === 'date'">
              {{ formatDateTime(record.date) }}
            </template>

            <template v-else-if="column.key === 'status'">
              <a-badge :status="getStatusBadge(record.status)" :text="getStatusText(record.status)" />
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button size="small" @click="viewDetails(record)">
                  Détails
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="handleAction($event, record)">
                      <a-menu-item key="edit" v-if="record.status === 'scheduled'">
                        <edit-outlined /> Modifier
                      </a-menu-item>
                      <a-menu-item key="start" v-if="record.status === 'scheduled'">
                        <play-circle-outlined /> Démarrer
                      </a-menu-item>
                      <a-menu-item key="complete" v-if="record.status === 'in_progress'">
                        <check-outlined /> Terminer
                      </a-menu-item>
                      <a-menu-item key="print">
                        <printer-outlined /> Imprimer
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="cancel" danger v-if="record.status !== 'completed'">
                        <close-outlined /> Annuler
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button size="small">
                    <ellipsis-outlined />
                  </a-button>
                </a-dropdown>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  PlusOutlined,
  CalendarOutlined,
  SearchOutlined,
  EditOutlined,
  PlayCircleOutlined,
  CheckOutlined,
  PrinterOutlined,
  CloseOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const loading = ref(false);

const filters = reactive({
  search: '',
  status: '',
  dateRange: null,
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total) => `Total ${total} consultations`,
});

const columns = [
  { title: 'Patient', key: 'patient', width: 200 },
  { title: 'Médecin', dataIndex: 'medecin', width: 150 },
  { title: 'Date', key: 'date', width: 180 },
  { title: 'Motif', dataIndex: 'motif', ellipsis: true },
  { title: 'Statut', key: 'status', width: 130 },
  { title: 'Actions', key: 'actions', fixed: 'right', width: 150 },
];

const consultations = ref([
  {
    id: 'CONS-001',
    patientId: 'P-2024-001',
    patientNom: 'Diallo',
    patientPrenom: 'Amadou',
    medecin: 'Dr. Koné',
    date: new Date(),
    motif: 'Contrôle de routine',
    status: 'scheduled',
  },
  {
    id: 'CONS-002',
    patientId: 'P-2024-002',
    patientNom: 'Traoré',
    patientPrenom: 'Aïssata',
    medecin: 'Dr. Sanogo',
    date: new Date(Date.now() - 3600000),
    motif: 'Céphalées persistantes',
    status: 'in_progress',
  },
  {
    id: 'CONS-003',
    patientId: 'P-2024-003',
    patientNom: 'Coulibaly',
    patientPrenom: 'Mamadou',
    medecin: 'Dr. Diabaté',
    date: new Date(Date.now() - 86400000),
    motif: 'Suivi diabète',
    status: 'completed',
  },
]);

const filteredConsultations = computed(() => {
  let result = [...consultations.value];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((c) =>
      c.patientNom.toLowerCase().includes(searchLower) ||
      c.patientPrenom.toLowerCase().includes(searchLower) ||
      c.medecin.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status) {
    result = result.filter((c) => c.status === filters.status);
  }

  pagination.total = result.length;
  return result;
});

const getStatusBadge = (status) => {
  const badges = {
    scheduled: 'default',
    in_progress: 'processing',
    completed: 'success',
    cancelled: 'error',
  };
  return badges[status] || 'default';
};

const getStatusText = (status) => {
  const texts = {
    scheduled: 'Planifiée',
    in_progress: 'En Cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };
  return texts[status] || status;
};

const formatDateTime = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const handleFilter = () => {
  pagination.current = 1;
};

const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.dateRange = null;
};

const viewPatient = (patientId) => {
  router.push(`/patients/${patientId}`);
};

const viewDetails = (record) => {
  router.push(`/consultations/${record.id}`);
};

const handleAction = ({ key }, record) => {
  console.log('Action:', key, record);
};
</script>

<style scoped lang="scss">
.consultations-list {
  .list-content {
    padding: 24px;
  }

  .filters-card {
    margin-bottom: 16px;
  }
}
</style>
