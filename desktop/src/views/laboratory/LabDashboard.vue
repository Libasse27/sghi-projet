<template>
  <div class="lab-dashboard">
    <a-page-header
      title="Laboratoire"
      sub-title="Tableau de bord des analyses"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/laboratory/create')">
          <template #icon><plus-outlined /></template>
          Nouvelle Demande
        </a-button>
        <a-button @click="refreshData">
          <template #icon><reload-outlined /></template>
          Actualiser
        </a-button>
      </template>
    </a-page-header>

    <div class="dashboard-content">
      <!-- Statistiques -->
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="stat-card pending">
            <a-statistic
              title="En Attente"
              :value="statistics.pending"
              :value-style="{ color: '#F59E0B' }"
            >
              <template #prefix>
                <clock-circle-outlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="stat-card in-progress">
            <a-statistic
              title="En Cours"
              :value="statistics.inProgress"
              :value-style="{ color: '#3B82F6' }"
            >
              <template #prefix>
                <experiment-outlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="stat-card completed">
            <a-statistic
              title="À Valider"
              :value="statistics.toValidate"
              :value-style="{ color: '#8B5CF6' }"
            >
              <template #prefix>
                <file-search-outlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="stat-card validated">
            <a-statistic
              title="Validées"
              :value="statistics.validated"
              :value-style="{ color: '#22C55E' }"
            >
              <template #prefix>
                <check-circle-outlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <!-- Actions Rapides -->
      <a-card title="Actions Rapides" class="quick-actions">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-button block size="large" @click="$router.push('/laboratory/list?status=pending')">
              <clock-circle-outlined />
              Demandes en Attente
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button block size="large" @click="$router.push('/laboratory/results-entry')">
              <edit-outlined />
              Saisir Résultats
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button block size="large" @click="$router.push('/laboratory/results-validation')">
              <file-search-outlined />
              Valider Résultats
            </a-button>
          </a-col>
          <a-col :span="6">
            <a-button block size="large" @click="$router.push('/laboratory/list')">
              <unordered-list-outlined />
              Toutes les Analyses
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- Analyses Récentes -->
      <a-card title="Analyses Récentes">
        <a-table
          :columns="columns"
          :data-source="recentAnalyses"
          :pagination="false"
          :loading="loading"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'patient'">
              <div>
                <div class="patient-name">{{ record.patientNom }} {{ record.patientPrenom }}</div>
                <div class="patient-id">ID: {{ record.patientId }}</div>
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
                      <a-menu-item key="entry" v-if="record.status === 'pending'">
                        <edit-outlined /> Saisir Résultats
                      </a-menu-item>
                      <a-menu-item key="validate" v-if="record.status === 'completed'">
                        <check-outlined /> Valider
                      </a-menu-item>
                      <a-menu-item key="print">
                        <printer-outlined /> Imprimer
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="cancel" danger>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  PlusOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  EditOutlined,
  UnorderedListOutlined,
  CheckOutlined,
  PrinterOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const loading = ref(false);

const statistics = reactive({
  pending: 12,
  inProgress: 8,
  toValidate: 5,
  validated: 45,
});

const columns = [
  {
    title: 'Patient',
    key: 'patient',
    width: 200,
  },
  {
    title: 'Type d\'Analyse',
    key: 'type',
    width: 180,
  },
  {
    title: 'Statut',
    key: 'status',
    width: 150,
  },
  {
    title: 'Priorité',
    key: 'priority',
    width: 120,
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

const recentAnalyses = ref([
  {
    id: 'LAB-001',
    patientId: 'P-2024-001',
    patientNom: 'Diallo',
    patientPrenom: 'Amadou',
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
    type: 'Bilan Lipidique',
    status: 'completed',
    priority: 'normal',
    requestDate: new Date(Date.now() - 7200000),
    requestedBy: 'Dr. Diabaté',
  },
]);

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

const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
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

onMounted(() => {
  refreshData();
});
</script>

<style scoped lang="scss">
.lab-dashboard {
  .dashboard-content {
    padding: 24px;
  }

  .stat-card {
    height: 100%;

    &.pending {
      border-left: 4px solid #F59E0B;
    }

    &.in-progress {
      border-left: 4px solid #3B82F6;
    }

    &.completed {
      border-left: 4px solid #8B5CF6;
    }

    &.validated {
      border-left: 4px solid #22C55E;
    }
  }

  .quick-actions {
    margin-top: 16px;

    .ant-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80px;
      gap: 8px;

      .anticon {
        font-size: 24px;
      }
    }
  }

  .patient-name {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .patient-id {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
