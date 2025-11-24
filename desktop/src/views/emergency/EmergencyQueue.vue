<template>
  <div class="emergency-queue">
    <a-page-header
      title="File d'attente des Urgences"
      sub-title="Vue en temps réel"
    >
      <template #extra>
        <a-space>
          <a-badge :count="stats.total" :overflow-count="99">
            <a-button>
              <template #icon><TeamOutlined /></template>
              Total patients
            </a-button>
          </a-badge>
          <a-switch
            v-model:checked="autoRefresh"
            checked-children="Auto"
            un-checked-children="Manuel"
          />
          <a-button @click="loadQueue" :loading="loading">
            <template #icon><ReloadOutlined /></template>
            Actualiser
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="queue-content">
      <!-- Filtres et statistiques -->
      <a-row :gutter="[16, 16]" class="queue-stats">
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-p1" @click="filterByPriority('P1')">
            <div class="stat-count">{{ stats.p1 }}</div>
            <div class="stat-label">P1 - Rouge</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-p2" @click="filterByPriority('P2')">
            <div class="stat-count">{{ stats.p2 }}</div>
            <div class="stat-label">P2 - Orange</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-p3" @click="filterByPriority('P3')">
            <div class="stat-count">{{ stats.p3 }}</div>
            <div class="stat-label">P3 - Jaune</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-p4" @click="filterByPriority('P4')">
            <div class="stat-count">{{ stats.p4 }}</div>
            <div class="stat-label">P4 - Vert</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-p5" @click="filterByPriority('P5')">
            <div class="stat-count">{{ stats.p5 }}</div>
            <div class="stat-label">P5 - Bleu</div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6" :lg="4">
          <div class="stat-box stat-all" @click="filterByPriority('')">
            <div class="stat-count">{{ stats.total }}</div>
            <div class="stat-label">Total</div>
          </div>
        </a-col>
      </a-row>

      <!-- Vue en liste/grille -->
      <a-card class="queue-list-card">
        <template #title>
          <a-space>
            <span>Patients en attente</span>
            <a-tag v-if="selectedPriority" closable @close="selectedPriority = ''">
              {{ selectedPriority }}
            </a-tag>
          </a-space>
        </template>
        <template #extra>
          <a-radio-group v-model:value="viewMode" button-style="solid">
            <a-radio-button value="list">
              <UnorderedListOutlined /> Liste
            </a-radio-button>
            <a-radio-button value="grid">
              <AppstoreOutlined /> Grille
            </a-radio-button>
          </a-radio-group>
        </template>

        <!-- Vue en liste -->
        <div v-if="viewMode === 'list'" class="list-view">
          <a-list
            :data-source="filteredQueue"
            :loading="loading"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button
                    type="primary"
                    size="small"
                    @click="handleTakeCare(item)"
                  >
                    Prendre en charge
                  </a-button>
                  <a-button size="small" @click="handleViewDetails(item)">
                    Détails
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a-space>
                      <a-tag :color="getPriorityColor(item.priority)">
                        {{ item.priority }}
                      </a-tag>
                      <span class="patient-name">
                        {{ item.patient.prenom }} {{ item.patient.nom }}
                      </span>
                      <a-tag :color="item.patient.sexe === 'M' ? 'blue' : 'pink'">
                        {{ item.patient.age }} ans
                      </a-tag>
                    </a-space>
                  </template>
                  <template #description>
                    <div class="patient-details">
                      <div><strong>Motif:</strong> {{ item.reason }}</div>
                      <div class="vitals">
                        <span><strong>TA:</strong> {{ item.vitals.bloodPressure }}</span>
                        <a-divider type="vertical" />
                        <span><strong>FC:</strong> {{ item.vitals.heartRate }} bpm</span>
                        <a-divider type="vertical" />
                        <span><strong>Temp:</strong> {{ item.vitals.temperature }}°C</span>
                        <a-divider type="vertical" />
                        <span><strong>Attente:</strong> {{ formatWaitTime(item.waitTime) }}</span>
                      </div>
                    </div>
                  </template>
                  <template #avatar>
                    <a-badge
                      :count="item.waitTime > 60 ? '!' : 0"
                      :number-style="{ backgroundColor: '#f5222d' }"
                    >
                      <a-avatar
                        :style="{
                          backgroundColor: getPriorityColor(item.priority),
                          color: '#fff',
                        }"
                        size="large"
                      >
                        {{ getInitials(item.patient) }}
                      </a-avatar>
                    </a-badge>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <!-- Vue en grille -->
        <div v-else class="grid-view">
          <a-row :gutter="[16, 16]">
            <a-col
              v-for="item in filteredQueue"
              :key="item.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <a-card
                :class="['patient-card', `priority-${item.priority.toLowerCase()}`]"
                :hoverable="true"
              >
                <template #title>
                  <a-space>
                    <a-tag :color="getPriorityColor(item.priority)">
                      {{ item.priority }}
                    </a-tag>
                    <span>{{ item.patient.prenom }} {{ item.patient.nom }}</span>
                  </a-space>
                </template>
                <template #extra>
                  <a-dropdown>
                    <MoreOutlined />
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="handleTakeCare(item)">
                          Prendre en charge
                        </a-menu-item>
                        <a-menu-item @click="handleViewDetails(item)">
                          Voir détails
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>

                <div class="card-content">
                  <div class="patient-info-grid">
                    <div class="info-item">
                      <UserOutlined />
                      <span>{{ item.patient.age }} ans • {{ item.patient.sexe === 'M' ? 'H' : 'F' }}</span>
                    </div>
                    <div class="info-item">
                      <ClockCircleOutlined />
                      <span class="wait-time">{{ formatWaitTime(item.waitTime) }}</span>
                    </div>
                  </div>

                  <a-divider style="margin: 12px 0" />

                  <div class="reason-text">
                    <strong>Motif:</strong> {{ item.reason }}
                  </div>

                  <a-divider style="margin: 12px 0" />

                  <div class="vitals-grid">
                    <div class="vital-item">
                      <span class="vital-label">TA</span>
                      <span class="vital-value">{{ item.vitals.bloodPressure }}</span>
                    </div>
                    <div class="vital-item">
                      <span class="vital-label">FC</span>
                      <span class="vital-value">{{ item.vitals.heartRate }}</span>
                    </div>
                    <div class="vital-item">
                      <span class="vital-label">Temp</span>
                      <span class="vital-value">{{ item.vitals.temperature }}°C</span>
                    </div>
                  </div>

                  <a-button
                    type="primary"
                    block
                    class="action-button"
                    @click="handleTakeCare(item)"
                  >
                    Prendre en charge
                  </a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- État vide -->
        <a-empty
          v-if="filteredQueue.length === 0 && !loading"
          description="Aucun patient en attente"
        >
          <a-button type="primary" @click="router.push('/emergency/triage')">
            Nouveau Triage
          </a-button>
        </a-empty>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  TeamOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();

// État
const loading = ref(false);
const autoRefresh = ref(true);
const viewMode = ref('list');
const selectedPriority = ref('');
let refreshInterval = null;

// Statistiques
const stats = reactive({
  p1: 3,
  p2: 5,
  p3: 8,
  p4: 3,
  p5: 2,
  total: 21,
});

// File d'attente (mock)
const queue = ref([
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
  },
]);

// Filtrage
const filteredQueue = computed(() => {
  if (!selectedPriority.value) return queue.value;
  return queue.value.filter((item) => item.priority === selectedPriority.value);
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

const getInitials = (patient) => {
  return `${patient.prenom[0]}${patient.nom[0]}`.toUpperCase();
};

const formatWaitTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
};

const filterByPriority = (priority) => {
  selectedPriority.value = priority;
};

// Actions
const loadQueue = async () => {
  loading.value = true;
  try {
    // TODO: Charger depuis l'API
    await new Promise((resolve) => setTimeout(resolve, 500));
    message.success('File d\'attente actualisée');
  } catch (error) {
    message.error('Erreur lors du chargement');
  } finally {
    loading.value = false;
  }
};

const handleTakeCare = (item) => {
  message.info(`Prise en charge de ${item.patient.prenom} ${item.patient.nom}`);
  // TODO: Ouvrir dossier de consultation
};

const handleViewDetails = (item) => {
  router.push(`/emergency/${item.id}`);
};

// Auto-refresh
const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    if (autoRefresh.value) {
      loadQueue();
    }
  }, 30000); // Toutes les 30 secondes
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Lifecycle
onMounted(() => {
  loadQueue();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped lang="scss">
.emergency-queue {
  .queue-content {
    padding: 24px;
  }

  .queue-stats {
    margin-bottom: 24px;

    .stat-box {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      border-left: 4px solid;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      &.stat-p1 {
        border-left-color: #dc2626;
      }

      &.stat-p2 {
        border-left-color: #f59e0b;
      }

      &.stat-p3 {
        border-left-color: #eab308;
      }

      &.stat-p4 {
        border-left-color: #22c55e;
      }

      &.stat-p5 {
        border-left-color: #3b82f6;
      }

      &.stat-all {
        border-left-color: #2c7a7b;
      }

      .stat-count {
        font-size: 32px;
        font-weight: bold;
        color: #2d3748;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 13px;
        color: #718096;
        font-weight: 500;
      }
    }
  }

  .queue-list-card {
    .patient-name {
      font-weight: 600;
      font-size: 15px;
      color: #2d3748;
    }

    .patient-details {
      color: #4a5568;
      font-size: 13px;

      .vitals {
        margin-top: 8px;
        color: #718096;
      }
    }

    .list-view {
      :deep(.ant-list-item) {
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background 0.3s;

        &:hover {
          background: #f7fafc;
        }
      }
    }

    .grid-view {
      .patient-card {
        border-left: 4px solid;

        &.priority-p1 {
          border-left-color: #dc2626;
        }

        &.priority-p2 {
          border-left-color: #f59e0b;
        }

        &.priority-p3 {
          border-left-color: #eab308;
        }

        &.priority-p4 {
          border-left-color: #22c55e;
        }

        &.priority-p5 {
          border-left-color: #3b82f6;
        }

        .card-content {
          .patient-info-grid {
            display: flex;
            justify-content: space-between;
            font-size: 13px;

            .info-item {
              display: flex;
              align-items: center;
              gap: 6px;
              color: #4a5568;

              .wait-time {
                font-weight: 600;
              }
            }
          }

          .reason-text {
            font-size: 13px;
            color: #4a5568;
            line-height: 1.5;
          }

          .vitals-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 16px;

            .vital-item {
              text-align: center;
              background: #f7fafc;
              padding: 8px;
              border-radius: 6px;

              .vital-label {
                display: block;
                font-size: 11px;
                color: #718096;
                margin-bottom: 4px;
              }

              .vital-value {
                display: block;
                font-weight: 600;
                color: #2d3748;
                font-size: 13px;
              }
            }
          }

          .action-button {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
