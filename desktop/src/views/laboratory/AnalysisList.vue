<template>
  <div class="analysis-list">
    <a-page-header
      title="Liste des Analyses"
      @back="() => $router.back()"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/laboratory/create')">
          <template #icon><plus-outlined /></template>
          Nouvelle Demande
        </a-button>
      </template>
    </a-page-header>

    <div class="list-content">
      <!-- Filtres -->
      <a-card class="filters-card">
        <a-form layout="inline">
          <a-form-item label="Recherche">
            <a-input
              v-model:value="filters.search"
              placeholder="Patient, ID analyse..."
              style="width: 250px"
              @change="handleFilter"
            >
              <template #prefix><search-outlined /></template>
            </a-input>
          </a-form-item>

          <a-form-item label="Statut">
            <a-select
              v-model:value="filters.status"
              style="width: 150px"
              @change="handleFilter"
            >
              <a-select-option value="">Tous</a-select-option>
              <a-select-option value="pending">En Attente</a-select-option>
              <a-select-option value="in_progress">En Cours</a-select-option>
              <a-select-option value="completed">À Valider</a-select-option>
              <a-select-option value="validated">Validée</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Priorité">
            <a-select
              v-model:value="filters.priority"
              style="width: 120px"
              @change="handleFilter"
            >
              <a-select-option value="">Toutes</a-select-option>
              <a-select-option value="urgent">Urgent</a-select-option>
              <a-select-option value="normal">Normal</a-select-option>
              <a-select-option value="low">Faible</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Type">
            <a-select
              v-model:value="filters.type"
              style="width: 180px"
              @change="handleFilter"
            >
              <a-select-option value="">Tous</a-select-option>
              <a-select-option value="Hémogramme">Hémogramme</a-select-option>
              <a-select-option value="Glycémie">Glycémie</a-select-option>
              <a-select-option value="Bilan Lipidique">Bilan Lipidique</a-select-option>
              <a-select-option value="Bilan Rénal">Bilan Rénal</a-select-option>
              <a-select-option value="Bilan Hépatique">Bilan Hépatique</a-select-option>
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
            <a-button @click="resetFilters">
              Réinitialiser
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Table -->
      <a-card>
        <a-table
          :columns="columns"
          :data-source="filteredAnalyses"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
              <a @click="viewDetails(record)">{{ record.id }}</a>
            </template>

            <template v-else-if="column.key === 'patient'">
              <div>
                <div class="patient-name">{{ record.patientNom }} {{ record.patientPrenom }}</div>
                <div class="patient-info">{{ record.patientAge }} ans • {{ record.patientSexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'type'">
              <a-tag :color="getTypeColor(record.type)">
                {{ record.type }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-badge :status="getStatusBadge(record.status)" :text="getStatusText(record.status)" />
            </template>

            <template v-else-if="column.key === 'priority'">
              <a-tag :color="getPriorityColor(record.priority)">
                {{ getPriorityText(record.priority) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'requestDate'">
              {{ formatDate(record.requestDate) }}
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button size="small" @click="viewDetails(record)">
                  Détails
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="handleAction($event, record)">
                      <a-menu-item key="entry" v-if="record.status === 'pending' || record.status === 'in_progress'">
                        <edit-outlined /> Saisir Résultats
                      </a-menu-item>
                      <a-menu-item key="validate" v-if="record.status === 'completed'">
                        <check-outlined /> Valider
                      </a-menu-item>
                      <a-menu-item key="print" v-if="record.status === 'validated'">
                        <printer-outlined /> Imprimer
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="cancel" danger v-if="record.status !== 'validated'">
                        <close-outlined /> Annuler
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button size="small">
                    Actions <down-outlined />
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
import { useRouter, useRoute } from 'vue-router';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  CheckOutlined,
  PrinterOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const loading = ref(false);

const filters = reactive({
  search: '',
  status: route.query.status || '',
  priority: '',
  type: '',
  dateRange: null,
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `Total ${total} analyses`,
});

const columns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    width: 120,
  },
  {
    title: 'Patient',
    key: 'patient',
    width: 200,
  },
  {
    title: 'Type',
    key: 'type',
    width: 150,
  },
  {
    title: 'Statut',
    key: 'status',
    width: 130,
  },
  {
    title: 'Priorité',
    key: 'priority',
    width: 100,
  },
  {
    title: 'Demandé par',
    dataIndex: 'requestedBy',
    width: 150,
  },
  {
    title: 'Date Demande',
    key: 'requestDate',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 180,
  },
];

// Mock data
const analyses = ref([
  {
    id: 'LAB-001',
    patientId: 'P-2024-001',
    patientNom: 'Diallo',
    patientPrenom: 'Amadou',
    patientAge: 45,
    patientSexe: 'M',
    type: 'Hémogramme',
    status: 'pending',
    priority: 'urgent',
    requestDate: new Date(),
    requestedBy: 'Dr. Koné',
  },
  {
    id: 'LAB-002',
    patientId: 'P-2024-002',
    patientNom: 'Traoré',
    patientPrenom: 'Aïssata',
    patientAge: 32,
    patientSexe: 'F',
    type: 'Glycémie',
    status: 'in_progress',
    priority: 'normal',
    requestDate: new Date(Date.now() - 3600000),
    requestedBy: 'Dr. Sanogo',
  },
  {
    id: 'LAB-003',
    patientId: 'P-2024-003',
    patientNom: 'Coulibaly',
    patientPrenom: 'Mamadou',
    patientAge: 58,
    patientSexe: 'M',
    type: 'Bilan Lipidique',
    status: 'completed',
    priority: 'normal',
    requestDate: new Date(Date.now() - 7200000),
    requestedBy: 'Dr. Diabaté',
  },
  {
    id: 'LAB-004',
    patientId: 'P-2024-004',
    patientNom: 'Konaté',
    patientPrenom: 'Fatoumata',
    patientAge: 28,
    patientSexe: 'F',
    type: 'Bilan Rénal',
    status: 'validated',
    priority: 'normal',
    requestDate: new Date(Date.now() - 86400000),
    requestedBy: 'Dr. Touré',
  },
  {
    id: 'LAB-005',
    patientId: 'P-2024-005',
    patientNom: 'Sidibé',
    patientPrenom: 'Ibrahim',
    patientAge: 62,
    patientSexe: 'M',
    type: 'Bilan Hépatique',
    status: 'pending',
    priority: 'urgent',
    requestDate: new Date(Date.now() - 1800000),
    requestedBy: 'Dr. Keita',
  },
]);

const filteredAnalyses = computed(() => {
  let result = [...analyses.value];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((a) =>
      a.id.toLowerCase().includes(searchLower) ||
      a.patientNom.toLowerCase().includes(searchLower) ||
      a.patientPrenom.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status) {
    result = result.filter((a) => a.status === filters.status);
  }

  if (filters.priority) {
    result = result.filter((a) => a.priority === filters.priority);
  }

  if (filters.type) {
    result = result.filter((a) => a.type === filters.type);
  }

  pagination.total = result.length;
  return result;
});

const getTypeColor = (type) => {
  const colors = {
    'Hémogramme': 'red',
    'Glycémie': 'orange',
    'Bilan Lipidique': 'blue',
    'Bilan Rénal': 'cyan',
    'Bilan Hépatique': 'green',
  };
  return colors[type] || 'default';
};

const getStatusBadge = (status) => {
  const badges = {
    pending: 'warning',
    in_progress: 'processing',
    completed: 'default',
    validated: 'success',
    cancelled: 'error',
  };
  return badges[status] || 'default';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'En Attente',
    in_progress: 'En Cours',
    completed: 'À Valider',
    validated: 'Validée',
    cancelled: 'Annulée',
  };
  return texts[status] || status;
};

const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'red',
    normal: 'blue',
    low: 'default',
  };
  return colors[priority] || 'default';
};

const getPriorityText = (priority) => {
  const texts = {
    urgent: 'Urgent',
    normal: 'Normal',
    low: 'Faible',
  };
  return texts[priority] || priority;
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const handleFilter = () => {
  pagination.current = 1;
};

const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.priority = '';
  filters.type = '';
  filters.dateRange = null;
  pagination.current = 1;
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

const viewDetails = (record) => {
  router.push(`/laboratory/${record.id}`);
};

const handleAction = ({ key }, record) => {
  switch (key) {
    case 'entry':
      router.push(`/laboratory/results-entry?id=${record.id}`);
      break;
    case 'validate':
      router.push(`/laboratory/results-validation?id=${record.id}`);
      break;
    case 'print':
      console.log('Imprimer', record);
      break;
    case 'cancel':
      console.log('Annuler', record);
      break;
  }
};
</script>

<style scoped lang="scss">
.analysis-list {
  .list-content {
    padding: 24px;
  }

  .filters-card {
    margin-bottom: 16px;
  }

  .patient-name {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .patient-info {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
