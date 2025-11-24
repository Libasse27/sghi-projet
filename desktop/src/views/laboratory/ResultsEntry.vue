<template>
  <div class="results-entry">
    <a-page-header
      title="Saisie des Résultats"
      sub-title="Enregistrer les résultats d'analyse"
      @back="() => $router.back()"
    />

    <div class="entry-content">
      <a-row :gutter="16">
        <!-- Sélection de l'analyse -->
        <a-col :span="24">
          <a-card title="Sélection de l'Analyse">
            <a-select
              v-model:value="selectedAnalysisId"
              show-search
              placeholder="Rechercher une analyse en attente"
              style="width: 100%"
              @change="loadAnalysis"
            >
              <a-select-option v-for="analysis in pendingAnalyses" :key="analysis.id" :value="analysis.id">
                {{ analysis.id }} - {{ analysis.patientNom }} {{ analysis.patientPrenom }} ({{ analysis.type }})
              </a-select-option>
            </a-select>
          </a-card>
        </a-col>

        <!-- Informations de l'analyse -->
        <a-col :span="24" v-if="currentAnalysis">
          <a-card title="Informations de l'Analyse">
            <a-descriptions bordered :column="2">
              <a-descriptions-item label="ID">{{ currentAnalysis.id }}</a-descriptions-item>
              <a-descriptions-item label="Type">
                <a-tag :color="getTypeColor(currentAnalysis.type)">{{ currentAnalysis.type }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Patient">
                {{ currentAnalysis.patientNom }} {{ currentAnalysis.patientPrenom }}
              </a-descriptions-item>
              <a-descriptions-item label="Date Demande">
                {{ formatDate(currentAnalysis.requestDate) }}
              </a-descriptions-item>
              <a-descriptions-item label="Médecin">{{ currentAnalysis.requestedBy }}</a-descriptions-item>
              <a-descriptions-item label="Priorité">
                <a-tag :color="getPriorityColor(currentAnalysis.priority)">
                  {{ getPriorityText(currentAnalysis.priority) }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- Formulaire de saisie -->
        <a-col :span="24" v-if="currentAnalysis">
          <a-card title="Résultats">
            <a-form :model="resultsForm" layout="vertical" @finish="handleSubmit">
              <a-table
                :columns="resultsColumns"
                :data-source="resultsData"
                :pagination="false"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'value'">
                    <a-input-number
                      v-model:value="record.value"
                      :precision="record.precision || 2"
                      style="width: 100%"
                    />
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="getResultStatus(record)">
                      {{ getResultStatusText(record) }}
                    </a-tag>
                  </template>
                </template>
              </a-table>

              <a-divider />

              <a-form-item label="Observations">
                <a-textarea
                  v-model:value="resultsForm.observations"
                  :rows="4"
                  placeholder="Observations du technicien"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>

              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading">
                    <template #icon><save-outlined /></template>
                    Enregistrer les Résultats
                  </a-button>
                  <a-button @click="resetForm">
                    Réinitialiser
                  </a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { SaveOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const selectedAnalysisId = ref(route.query.id || undefined);
const currentAnalysis = ref(null);

const resultsForm = reactive({
  observations: '',
});

const pendingAnalyses = ref([
  {
    id: 'LAB-001',
    patientNom: 'Diallo',
    patientPrenom: 'Amadou',
    type: 'Hémogramme',
    priority: 'urgent',
    requestDate: new Date(),
    requestedBy: 'Dr. Koné',
  },
  {
    id: 'LAB-002',
    patientNom: 'Traoré',
    patientPrenom: 'Aïssata',
    type: 'Glycémie',
    priority: 'normal',
    requestDate: new Date(Date.now() - 3600000),
    requestedBy: 'Dr. Sanogo',
  },
]);

const resultsColumns = [
  { title: 'Paramètre', dataIndex: 'parameter', key: 'parameter' },
  { title: 'Valeur', key: 'value', width: 150 },
  { title: 'Unité', dataIndex: 'unit', key: 'unit', width: 100 },
  { title: 'Valeurs Normales', dataIndex: 'normalRange', key: 'normalRange', width: 150 },
  { title: 'Statut', key: 'status', width: 120 },
];

const resultsData = ref([
  { parameter: 'Globules Rouges', value: null, unit: 'M/μL', normalRange: '4.5-5.5', normalMin: 4.5, normalMax: 5.5, precision: 2 },
  { parameter: 'Hémoglobine', value: null, unit: 'g/dL', normalRange: '13-17', normalMin: 13, normalMax: 17, precision: 1 },
  { parameter: 'Hématocrite', value: null, unit: '%', normalRange: '40-50', normalMin: 40, normalMax: 50, precision: 1 },
  { parameter: 'Globules Blancs', value: null, unit: 'K/μL', normalRange: '4-11', normalMin: 4, normalMax: 11, precision: 2 },
  { parameter: 'Plaquettes', value: null, unit: 'K/μL', normalRange: '150-400', normalMin: 150, normalMax: 400, precision: 0 },
]);

const getTypeColor = (type) => {
  const colors = {
    'Hémogramme': 'red',
    'Glycémie': 'orange',
    'Bilan Lipidique': 'blue',
  };
  return colors[type] || 'default';
};

const getPriorityColor = (priority) => {
  return priority === 'urgent' ? 'red' : 'blue';
};

const getPriorityText = (priority) => {
  return priority === 'urgent' ? 'Urgent' : 'Normal';
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const getResultStatus = (record) => {
  if (!record.value) return 'default';
  if (record.value < record.normalMin) return 'error';
  if (record.value > record.normalMax) return 'warning';
  return 'success';
};

const getResultStatusText = (record) => {
  if (!record.value) return 'Non renseigné';
  if (record.value < record.normalMin) return 'Bas';
  if (record.value > record.normalMax) return 'Élevé';
  return 'Normal';
};

const loadAnalysis = (id) => {
  currentAnalysis.value = pendingAnalyses.value.find((a) => a.id === id);
};

const resetForm = () => {
  resultsData.value.forEach((item) => {
    item.value = null;
  });
  resultsForm.observations = '';
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success('Résultats enregistrés avec succès');
    router.push('/laboratory/list');
  } catch (error) {
    message.error('Erreur lors de l\'enregistrement');
  } finally {
    loading.value = false;
  }
};

// Auto-load if ID in query
if (selectedAnalysisId.value) {
  loadAnalysis(selectedAnalysisId.value);
}
</script>

<style scoped lang="scss">
.results-entry {
  .entry-content {
    padding: 24px;
  }
}
</style>
