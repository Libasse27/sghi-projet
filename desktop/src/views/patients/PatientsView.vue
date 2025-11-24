<template>
  <div class="patients-view">
    <a-page-header
      title="Gestion des patients"
      sub-title="Liste de tous les patients"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/patients/create')">
          <template #icon><user-add-outlined /></template>
          Nouveau patient
        </a-button>
      </template>
    </a-page-header>

    <a-card :bordered="false" style="margin-top: 16px">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <!-- Search and Filters -->
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12" :md="8">
            <a-input-search
              v-model:value="searchText"
              placeholder="Rechercher par nom, NUP, téléphone..."
              size="large"
              @search="handleSearch"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="4">
            <a-button size="large" block>
              <template #icon><filter-outlined /></template>
              Filtres
            </a-button>
          </a-col>
        </a-row>

        <!-- Patients Table -->
        <a-table
          :columns="columns"
          :data-source="patients"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fullName'">
              <div class="patient-info">
                <a-avatar :size="40" :style="{ backgroundColor: '#2C7A7B' }">
                  {{ getInitials(record.nom, record.prenom) }}
                </a-avatar>
                <div>
                  <div class="patient-name">{{ record.prenom }} {{ record.nom }}</div>
                  <div class="patient-nup">{{ record.numeroPatient }}</div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'sexe'">
              <a-tag :color="record.sexe === 'M' ? 'blue' : 'pink'">
                {{ record.sexe === 'M' ? 'Masculin' : 'Féminin' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small">
                  <template #icon><eye-outlined /></template>
                  Voir
                </a-button>
                <a-button type="link" size="small">
                  <template #icon><edit-outlined /></template>
                  Modifier
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  UserAddOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';

const searchText = ref('');
const loading = ref(false);

const columns = [
  { title: 'Patient', key: 'fullName', dataIndex: 'fullName' },
  { title: 'Date de naissance', dataIndex: 'dateNaissance', key: 'dateNaissance' },
  { title: 'Sexe', dataIndex: 'sexe', key: 'sexe' },
  { title: 'Téléphone', dataIndex: 'telephone', key: 'telephone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Actions', key: 'actions' },
];

const patients = ref([
  {
    key: 1,
    numeroPatient: 'NUP-2024-001',
    nom: 'Diop',
    prenom: 'Amadou',
    dateNaissance: '1985-03-15',
    sexe: 'M',
    telephone: '+221771234567',
    email: 'amadou.diop@email.com',
  },
  {
    key: 2,
    numeroPatient: 'NUP-2024-002',
    nom: 'Fall',
    prenom: 'Fatou',
    dateNaissance: '1990-07-22',
    sexe: 'F',
    telephone: '+221771234568',
    email: 'fatou.fall@email.com',
  },
]);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 50,
  showSizeChanger: true,
  showTotal: (total) => `Total ${total} patients`,
});

const getInitials = (nom, prenom) => {
  return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
};

const handleSearch = () => {
  console.log('Search:', searchText.value);
};

const handleTableChange = (pag, filters, sorter) => {
  pagination.value = pag;
};
</script>

<style scoped lang="scss">
.patients-view {
  .patient-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .patient-name {
      font-weight: 500;
      color: #262626;
    }

    .patient-nup {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
}
</style>
