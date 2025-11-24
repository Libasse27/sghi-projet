<template>
  <div class="dashboard">
    <a-page-header
      title="Tableau de bord"
      :sub-title="`Bienvenue, ${authStore.userFullName}`"
    />

    <!-- Statistics Cards -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="Patients aujourd'hui"
            :value="stats.todayPatients"
            :prefix="h(UserOutlined)"
            :value-style="{ color: '#2C7A7B' }"
          />
          <div class="stat-footer">
            <arrow-up-outlined style="color: #48BB78" />
            <span class="stat-change positive">+12%</span>
            <span class="stat-label">vs hier</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="Consultations"
            :value="stats.todayConsultations"
            :prefix="h(MedicineBoxOutlined)"
            :value-style="{ color: '#4299E1' }"
          />
          <div class="stat-footer">
            <arrow-up-outlined style="color: #48BB78" />
            <span class="stat-change positive">+8%</span>
            <span class="stat-label">vs hier</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="Urgences"
            :value="stats.emergencyCases"
            :prefix="h(AlertOutlined)"
            :value-style="{ color: '#F56565' }"
          />
          <div class="stat-footer">
            <arrow-down-outlined style="color: #48BB78" />
            <span class="stat-change positive">-5%</span>
            <span class="stat-label">vs hier</span>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <a-statistic
            title="Occupation lits"
            :value="stats.bedOccupancy"
            suffix="%"
            :prefix="h(HomeOutlined)"
            :value-style="{ color: '#ED8936' }"
          />
          <div class="stat-footer">
            <span class="stat-label">{{ stats.occupiedBeds }}/{{ stats.totalBeds }} lits</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <!-- Patient Flow Chart -->
      <a-col :xs="24" :lg="16">
        <a-card title="Flux de patients - 7 derniers jours" :bordered="false">
          <Line :data="patientFlowData" :options="chartOptions" />
        </a-card>
      </a-col>

      <!-- Appointments Today -->
      <a-col :xs="24" :lg="8">
        <a-card title="Rendez-vous du jour" :bordered="false">
          <a-list
            :data-source="todayAppointments"
            :locale="{ emptyText: 'Aucun rendez-vous' }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-typography-text strong>{{ item.patientName }}</a-typography-text>
                  </template>
                  <template #description>
                    <div class="appointment-info">
                      <clock-circle-outlined />
                      {{ item.time }}
                      <a-tag :color="item.statusColor" size="small" style="margin-left: 8px">
                        {{ item.status }}
                      </a-tag>
                    </div>
                  </template>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: '#2C7A7B' }">
                      {{ item.patientInitials }}
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <!-- Emergency Queue -->
      <a-col :xs="24" :lg="12">
        <a-card title="File d'attente urgences" :bordered="false">
          <a-table
            :columns="emergencyColumns"
            :data-source="emergencyQueue"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'priority'">
                <a-tag :color="getPriorityColor(record.priority)">
                  {{ record.priority }}
                </a-tag>
              </template>
              <template v-if="column.key === 'waitTime'">
                {{ record.waitTime }} min
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- Recent Activities -->
      <a-col :xs="24" :lg="12">
        <a-card title="Activités récentes" :bordered="false">
          <a-timeline>
            <a-timeline-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :color="activity.color"
            >
              <template #dot>
                <component :is="activity.icon" />
              </template>
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { h, ref, reactive, onMounted } from 'vue';
import {
  UserOutlined,
  MedicineBoxOutlined,
  AlertOutlined,
  HomeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAuthStore } from '@/store/auth';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const authStore = useAuthStore();

// Statistics
const stats = reactive({
  todayPatients: 45,
  todayConsultations: 32,
  emergencyCases: 8,
  bedOccupancy: 78,
  occupiedBeds: 62,
  totalBeds: 80,
});

// Patient Flow Chart Data
const patientFlowData = ref({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Patients',
      data: [42, 38, 45, 51, 48, 35, 30],
      borderColor: '#2C7A7B',
      backgroundColor: 'rgba(44, 122, 123, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Consultations',
      data: [35, 32, 38, 42, 40, 28, 25],
      borderColor: '#4299E1',
      backgroundColor: 'rgba(66, 153, 225, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Today's Appointments
const todayAppointments = ref([
  {
    id: 1,
    patientName: 'Amadou Diop',
    patientInitials: 'AD',
    time: '09:00',
    status: 'En cours',
    statusColor: 'processing',
  },
  {
    id: 2,
    patientName: 'Fatou Fall',
    patientInitials: 'FF',
    time: '10:30',
    status: 'En attente',
    statusColor: 'warning',
  },
  {
    id: 3,
    patientName: 'Ousmane Sow',
    patientInitials: 'OS',
    time: '11:00',
    status: 'Confirmé',
    statusColor: 'success',
  },
  {
    id: 4,
    patientName: 'Aissatou Ba',
    patientInitials: 'AB',
    time: '14:00',
    status: 'Confirmé',
    statusColor: 'success',
  },
]);

// Emergency Queue
const emergencyColumns = [
  { title: 'Patient', dataIndex: 'patient', key: 'patient' },
  { title: 'Priorité', dataIndex: 'priority', key: 'priority' },
  { title: 'Temps d\'attente', dataIndex: 'waitTime', key: 'waitTime' },
];

const emergencyQueue = ref([
  { key: 1, patient: 'Moussa Cissé', priority: 'P1', waitTime: 5 },
  { key: 2, patient: 'Khadija Touré', priority: 'P2', waitTime: 12 },
  { key: 3, patient: 'Ibrahima Sarr', priority: 'P3', waitTime: 25 },
  { key: 4, patient: 'Mariama Ndiaye', priority: 'P4', waitTime: 40 },
]);

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

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    title: 'Nouveau patient enregistré: Amadou Diop',
    time: 'Il y a 5 minutes',
    color: 'green',
    icon: h(UserOutlined),
  },
  {
    id: 2,
    title: 'Consultation terminée: Fatou Fall',
    time: 'Il y a 15 minutes',
    color: 'blue',
    icon: h(CheckCircleOutlined),
  },
  {
    id: 3,
    title: 'Résultats de laboratoire disponibles',
    time: 'Il y a 30 minutes',
    color: 'purple',
    icon: h(ExperimentOutlined),
  },
  {
    id: 4,
    title: 'Admission aux urgences: Cas P2',
    time: 'Il y a 1 heure',
    color: 'orange',
    icon: h(AlertOutlined),
  },
]);

onMounted(() => {
  // Charger les données réelles depuis l'API
  // loadDashboardData();
});
</script>

<style scoped lang="scss">
.dashboard {
  .stats-row {
    .stat-card {
      :deep(.ant-card-body) {
        padding: 20px;
      }

      .stat-footer {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #8c8c8c;

        .stat-change {
          font-weight: 600;

          &.positive {
            color: #48BB78;
          }

          &.negative {
            color: #F56565;
          }
        }
      }
    }
  }

  .appointment-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
  }

  .activity-title {
    margin: 0;
    font-size: 14px;
    color: #262626;
  }

  .activity-time {
    margin: 0;
    font-size: 12px;
    color: #8c8c8c;
  }

  :deep(.ant-card) {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);
  }

  :deep(canvas) {
    max-height: 300px;
  }
}
</style>
