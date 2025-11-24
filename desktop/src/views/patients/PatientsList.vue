<template>
  <div class="patients-list">
    <a-page-header title="Gestion des Patients">
      <template #extra>
        <a-button type="primary" @click="$router.push('/patients/create')">
          <template #icon><user-add-outlined /></template>
          Nouveau Patient
        </a-button>
      </template>
    </a-page-header>

    <div class="list-content">
      <!-- Filtres et Recherche -->
      <a-card class="filters-card">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              v-model:value="filters.search"
              placeholder="Rechercher (Nom, ID, Téléphone...)"
              style="width: 300px"
              @change="handleFilter"
            >
              <template #prefix><search-outlined /></template>
            </a-input>
          </a-form-item>

          <a-form-item label="Sexe">
            <a-select v-model:value="filters.sexe" style="width: 120px" @change="handleFilter">
              <a-select-option value="">Tous</a-select-option>
              <a-select-option value="M">Masculin</a-select-option>
              <a-select-option value="F">Féminin</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Groupe Sanguin">
            <a-select v-model:value="filters.groupeSanguin" style="width: 120px" @change="handleFilter">
              <a-select-option value="">Tous</a-select-option>
              <a-select-option value="A+">A+</a-select-option>
              <a-select-option value="A-">A-</a-select-option>
              <a-select-option value="B+">B+</a-select-option>
              <a-select-option value="B-">B-</a-select-option>
              <a-select-option value="O+">O+</a-select-option>
              <a-select-option value="O-">O-</a-select-option>
              <a-select-option value="AB+">AB+</a-select-option>
              <a-select-option value="AB-">AB-</a-select-option>
            </a-select>
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
          :data-source="filteredPatients"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
              <a @click="viewDetails(record)">{{ record.id }}</a>
            </template>

            <template v-else-if="column.key === 'patient'">
              <div class="patient-info">
                <a-avatar :size="40" :style="{ backgroundColor: getAvatarColor(record.nom) }">
                  {{ getInitials(record.nom, record.prenom) }}
                </a-avatar>
                <div class="patient-details">
                  <div class="patient-name">{{ record.nom }} {{ record.prenom }}</div>
                  <div class="patient-meta">{{ record.age }} ans • {{ record.sexe === 'M' ? 'Masculin' : 'Féminin' }}</div>
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'contact'">
              <div>
                <div><phone-outlined /> {{ record.telephone }}</div>
                <div v-if="record.email"><mail-outlined /> {{ record.email }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'groupeSanguin'">
              <a-tag color="red">{{ record.groupeSanguin }}</a-tag>
            </template>

            <template v-else-if="column.key === 'dateCreation'">
              {{ formatDate(record.dateCreation) }}
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button size="small" @click="viewDetails(record)">
                  Détails
                </a-button>
                <a-button size="small" @click="editPatient(record)">
                  <template #icon><edit-outlined /></template>
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="handleAction($event, record)">
                      <a-menu-item key="consultation">
                        <file-text-outlined /> Nouvelle Consultation
                      </a-menu-item>
                      <a-menu-item key="lab">
                        <experiment-outlined /> Demande d'Analyse
                      </a-menu-item>
                      <a-menu-item key="history">
                        <history-outlined /> Historique
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="delete" danger>
                        <delete-outlined /> Supprimer
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
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  HistoryOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const loading = ref(false);

const filters = reactive({
  search: '',
  sexe: '',
  groupeSanguin: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total) => `Total ${total} patients`,
});

const columns = [
  { title: 'ID', key: 'id', dataIndex: 'id', width: 120 },
  { title: 'Patient', key: 'patient', width: 250 },
  { title: 'Contact', key: 'contact', width: 200 },
  { title: 'Groupe Sanguin', key: 'groupeSanguin', width: 130 },
  { title: 'Adresse', dataIndex: 'adresse', ellipsis: true },
  { title: 'Date Création', key: 'dateCreation', width: 150 },
  { title: 'Actions', key: 'actions', fixed: 'right', width: 180 },
];

const patients = ref([
  {
    id: 'P-2024-001',
    nom: 'Diallo',
    prenom: 'Amadou',
    age: 45,
    sexe: 'M',
    telephone: '+223 70 12 34 56',
    email: 'amadou.diallo@email.com',
    adresse: 'Bamako, Badalabougou',
    groupeSanguin: 'A+',
    dateCreation: new Date('2024-01-15'),
  },
  {
    id: 'P-2024-002',
    nom: 'Traoré',
    prenom: 'Aïssata',
    age: 32,
    sexe: 'F',
    telephone: '+223 76 98 76 54',
    email: 'aissata.traore@email.com',
    adresse: 'Bamako, Hippodrome',
    groupeSanguin: 'O+',
    dateCreation: new Date('2024-02-10'),
  },
  {
    id: 'P-2024-003',
    nom: 'Coulibaly',
    prenom: 'Mamadou',
    age: 58,
    sexe: 'M',
    telephone: '+223 65 43 21 09',
    adresse: 'Bamako, Kalaban Coura',
    groupeSanguin: 'B+',
    dateCreation: new Date('2024-02-20'),
  },
]);

const filteredPatients = computed(() => {
  let result = [...patients.value];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter((p) =>
      p.id.toLowerCase().includes(searchLower) ||
      p.nom.toLowerCase().includes(searchLower) ||
      p.prenom.toLowerCase().includes(searchLower) ||
      p.telephone.includes(searchLower)
    );
  }

  if (filters.sexe) {
    result = result.filter((p) => p.sexe === filters.sexe);
  }

  if (filters.groupeSanguin) {
    result = result.filter((p) => p.groupeSanguin === filters.groupeSanguin);
  }

  pagination.total = result.length;
  return result;
});

const getAvatarColor = (nom) => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff'];
  const index = nom.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (nom, prenom) => {
  return `${nom[0]}${prenom[0]}`.toUpperCase();
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const handleFilter = () => {
  pagination.current = 1;
};

const resetFilters = () => {
  filters.search = '';
  filters.sexe = '';
  filters.groupeSanguin = '';
  pagination.current = 1;
};

const handleTableChange = (pag) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

const viewDetails = (record) => {
  router.push(`/patients/${record.id}`);
};

const editPatient = (record) => {
  router.push(`/patients/${record.id}/edit`);
};

const handleAction = ({ key }, record) => {
  switch (key) {
    case 'consultation':
      router.push(`/consultations/create?patientId=${record.id}`);
      break;
    case 'lab':
      router.push(`/laboratory/create?patientId=${record.id}`);
      break;
    case 'history':
      router.push(`/patients/${record.id}?tab=history`);
      break;
    case 'delete':
      console.log('Supprimer', record);
      break;
  }
};
</script>

<style scoped lang="scss">
.patients-list {
  .list-content {
    padding: 24px;
  }

  .filters-card {
    margin-bottom: 16px;
  }

  .patient-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .patient-details {
      flex: 1;

      .patient-name {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }

      .patient-meta {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
</style>
