<template>
  <div class="emergency-dashboard">
    <!-- En-tête avec statistiques -->
    <div class="dashboard-header">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card stat-critical">
            <a-statistic
              title="P1 - Urgence Absolue"
              :value="stats.p1"
              :prefix="h(WarningOutlined)"
              :value-style="{ color: '#DC2626' }"
            />
            <div class="stat-footer">
              <span class="stat-label">Critique</span>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card stat-urgent">
            <a-statistic
              title="P2 - Urgence Relative"
              :value="stats.p2"
              :prefix="h(AlertOutlined)"
              :value-style="{ color: '#F59E0B' }"
            />
            <div class="stat-footer">
              <span class="stat-label">Urgent</span>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card stat-moderate">
            <a-statistic
              title="P3 - Non Vitale"
              :value="stats.p3"
              :prefix="h(ExclamationCircleOutlined)"
              :value-style="{ color: '#EAB308' }"
            />
            <div class="stat-footer">
              <span class="stat-label">Modéré</span>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card stat-stable">
            <a-statistic
              title="Total en attente"
              :value="stats.total"
              :prefix="h(ClockCircleOutlined)"
              :value-style="{ color: '#2C7A7B' }"
            />
            <div class="stat-footer">
              <span class="stat-label">Patients</span>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Actions rapides -->
    <div class="quick-actions">
      <a-space :size="12">
        <a-button
          type="primary"
          size="large"
          @click="showTriageModal = true"
        >
          <template #icon><PlusOutlined /></template>
          Nouveau Triage
        </a-button>
        <a-button
          size="large"
          @click="router.push('/emergency/triage')"
        >
          <template #icon><FormOutlined /></template>
          Accéder au Triage
        </a-button>
        <a-button
          size="large"
          @click="loadEmergencies"
        >
          <template #icon><ReloadOutlined /></template>
          Actualiser
        </a-button>
      </a-space>
    </div>

    <!-- File d'attente des urgences -->
    <a-card title="File d'attente des urgences" class="emergency-queue-card">
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Rechercher un patient..."
            style="width: 300px"
            @search="handleSearch"
          />
          <a-select
            v-model:value="filterPriority"
            style="width: 150px"
            placeholder="Filtrer par priorité"
            @change="handleFilter"
          >
            <a-select-option value="">Toutes</a-select-option>
            <a-select-option value="P1">P1 - Rouge</a-select-option>
            <a-select-option value="P2">P2 - Orange</a-select-option>
            <a-select-option value="P3">P3 - Jaune</a-select-option>
            <a-select-option value="P4">P4 - Vert</a-select-option>
            <a-select-option value="P5">P5 - Bleu</a-select-option>
          </a-select>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="filteredEmergencies"
        :loading="loading"
        :pagination="{
          total: filteredEmergencies.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} patient(s)`,
        }"
        row-key="id"
      >
        <!-- Priorité avec couleur -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'priority'">
            <a-tag :color="getPriorityColor(record.priority)" class="priority-tag">
              <template #icon>
                <component :is="getPriorityIcon(record.priority)" />
              </template>
              {{ record.priority }} - {{ getPriorityLabel(record.priority) }}
            </a-tag>
          </template>

          <!-- Patient -->
          <template v-else-if="column.key === 'patient'">
            <div class="patient-info">
              <div class="patient-name">{{ record.patient.nom }} {{ record.patient.prenom }}</div>
              <div class="patient-age">{{ record.patient.age }} ans • {{ record.patient.sexe === 'M' ? 'Homme' : 'Femme' }}</div>
            </div>
          </template>

          <!-- Motif -->
          <template v-else-if="column.key === 'reason'">
            <div class="reason-cell">
              {{ record.reason }}
            </div>
          </template>

          <!-- Temps d'attente -->
          <template v-else-if="column.key === 'waitTime'">
            <a-tag :color="getWaitTimeColor(record.waitTime)">
              {{ formatWaitTime(record.waitTime) }}
            </a-tag>
          </template>

          <!-- Constantes -->
          <template v-else-if="column.key === 'vitals'">
            <div class="vitals-cell">
              <div><strong>TA:</strong> {{ record.vitals.bloodPressure }}</div>
              <div><strong>FC:</strong> {{ record.vitals.heartRate }} bpm</div>
              <div><strong>Temp:</strong> {{ record.vitals.temperature }}°C</div>
            </div>
          </template>

          <!-- Actions -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button
                type="primary"
                size="small"
                @click="handleTakeCare(record)"
              >
                Prendre en charge
              </a-button>
              <a-button
                size="small"
                @click="handleViewDetails(record)"
              >
                Détails
              </a-button>
              <a-dropdown>
                <a-button size="small">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleReassignPriority(record)">
                      Réassigner priorité
                    </a-menu-item>
                    <a-menu-item @click="handleTransfer(record)">
                      Transférer
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item danger @click="handleCancel(record)">
                      Annuler
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Modal Nouveau Triage -->
    <a-modal
      v-model:open="showTriageModal"
      title="Nouveau Triage"
      width="600px"
      @ok="handleTriageSubmit"
    >
      <p>Redirection vers la page de triage...</p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  WarningOutlined,
  AlertOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  FormOutlined,
  ReloadOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const router = useRouter();

// État
const loading = ref(false);
const searchQuery = ref('');
const filterPriority = ref('');
const showTriageModal = ref(false);

// Statistiques
const stats = reactive({
  p1: 3,
  p2: 5,
  p3: 8,
  total: 21,
});

// Données mockées des urgences
const emergencies = ref([
  {
    id: '1',
    priority: 'P1',
    patient: {
      nom: 'Diallo',
      prenom: 'Amadou',
      age: 45,
      sexe: 'M',
    },
    reason: 'Douleur thoracique intense',
    vitals: {
      bloodPressure: '180/110',
      heartRate: 110,
      temperature: 37.2,
    },
    arrivalTime: dayjs().subtract(15, 'minutes').toISOString(),
    waitTime: 15,
    status: 'waiting',
  },
  {
    id: '2',
    priority: 'P2',
    patient: {
      nom: 'Ndiaye',
      prenom: 'Fatou',
      age: 32,
      sexe: 'F',
    },
    reason: 'Fracture du bras gauche',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 85,
      temperature: 36.8,
    },
    arrivalTime: dayjs().subtract(45, 'minutes').toISOString(),
    waitTime: 45,
    status: 'waiting',
  },
  {
    id: '3',
    priority: 'P3',
    patient: {
      nom: 'Sow',
      prenom: 'Mariama',
      age: 28,
      sexe: 'F',
    },
    reason: 'Fièvre et maux de tête',
    vitals: {
      bloodPressure: '115/75',
      heartRate: 78,
      temperature: 38.5,
    },
    arrivalTime: dayjs().subtract(90, 'minutes').toISOString(),
    waitTime: 90,
    status: 'waiting',
  },
]);

// Colonnes du tableau
const columns = [
  {
    title: 'Priorité',
    key: 'priority',
    width: 180,
    sorter: (a, b) => a.priority.localeCompare(b.priority),
  },
  {
    title: 'Patient',
    key: 'patient',
    width: 200,
  },
  {
    title: 'Motif',
    key: 'reason',
    ellipsis: true,
  },
  {
    title: 'Constantes',
    key: 'vitals',
    width: 150,
  },
  {
    title: 'Attente',
    key: 'waitTime',
    width: 100,
    sorter: (a, b) => a.waitTime - b.waitTime,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
];

// Filtrage des urgences
const filteredEmergencies = computed(() => {
  let result = emergencies.value;

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.patient.nom.toLowerCase().includes(query) ||
        e.patient.prenom.toLowerCase().includes(query) ||
        e.reason.toLowerCase().includes(query)
    );
  }

  // Filtre par priorité
  if (filterPriority.value) {
    result = result.filter((e) => e.priority === filterPriority.value);
  }

  return result;
});

// Helpers
const getPriorityColor = (priority) => {
  const colors = {
    P1: 'red',
    P2: 'orange',
    P3: 'gold',
    P4: 'green',
    P5: 'blue',
  };
  return colors[priority] || 'default';
};

const getPriorityIcon = (priority) => {
  const icons = {
    P1: WarningOutlined,
    P2: AlertOutlined,
    P3: ExclamationCircleOutlined,
    P4: ClockCircleOutlined,
    P5: ClockCircleOutlined,
  };
  return icons[priority] || ClockCircleOutlined;
};

const getPriorityLabel = (priority) => {
  const labels = {
    P1: 'Critique',
    P2: 'Urgent',
    P3: 'Non vital',
    P4: 'Rapide',
    P5: 'Consultation',
  };
  return labels[priority] || '';
};

const getWaitTimeColor = (minutes) => {
  if (minutes < 30) return 'success';
  if (minutes < 60) return 'warning';
  return 'error';
};

const formatWaitTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};

// Actions
const loadEmergencies = async () => {
  loading.value = true;
  try {
    // TODO: Charger depuis l'API
    await new Promise((resolve) => setTimeout(resolve, 500));
    message.success('Liste actualisée');
  } catch (error) {
    message.error('Erreur lors du chargement');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // La recherche est déjà gérée par le computed
};

const handleFilter = () => {
  // Le filtre est déjà géré par le computed
};

const handleTakeCare = (record) => {
  message.info(`Prise en charge de ${record.patient.prenom} ${record.patient.nom}`);
  // TODO: Ouvrir le dossier de consultation
};

const handleViewDetails = (record) => {
  router.push(`/emergency/${record.id}`);
};

const handleReassignPriority = (record) => {
  message.info('Réassignation de priorité');
  // TODO: Ouvrir modal de réassignation
};

const handleTransfer = (record) => {
  message.info('Transfert du patient');
  // TODO: Ouvrir modal de transfert
};

const handleCancel = (record) => {
  message.warning('Annulation de l\'urgence');
  // TODO: Confirmer et annuler
};

const handleTriageSubmit = () => {
  showTriageModal.value = false;
  router.push('/emergency/triage');
};

// Lifecycle
onMounted(() => {
  loadEmergencies();
});
</script>

<style scoped lang="scss">
.emergency-dashboard {
  padding: 24px;

  .dashboard-header {
    margin-bottom: 24px;
  }

  .stat-card {
    border-left: 4px solid;
    transition: all 0.3s;

    &.stat-critical {
      border-left-color: #dc2626;
    }

    &.stat-urgent {
      border-left-color: #f59e0b;
    }

    &.stat-moderate {
      border-left-color: #eab308;
    }

    &.stat-stable {
      border-left-color: #2c7a7b;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .stat-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;

      .stat-label {
        color: #8c8c8c;
        font-size: 13px;
      }
    }
  }

  .quick-actions {
    margin-bottom: 24px;
  }

  .emergency-queue-card {
    :deep(.ant-card-head) {
      background: #f7fafc;
    }

    .priority-tag {
      font-weight: 600;
    }

    .patient-info {
      .patient-name {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 4px;
      }

      .patient-age {
        font-size: 12px;
        color: #718096;
      }
    }

    .reason-cell {
      color: #4a5568;
      line-height: 1.4;
    }

    .vitals-cell {
      font-size: 12px;
      line-height: 1.6;

      div {
        margin-bottom: 2px;

        strong {
          color: #2d3748;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
