<template>
  <div class="results-validation">
    <a-page-header
      title="Validation des Résultats"
      sub-title="Valider les résultats d'analyse"
      @back="() => $router.back()"
    />

    <div class="validation-content">
      <a-row :gutter="16">
        <!-- Liste des analyses à valider -->
        <a-col :span="8">
          <a-card title="Analyses à Valider" :body-style="{ padding: 0 }">
            <a-list
              :data-source="analysesToValidate"
              :loading="loading"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  :class="{ 'selected-item': selectedAnalysis?.id === item.id }"
                  style="cursor: pointer; padding: 12px 16px"
                  @click="selectAnalysis(item)"
                >
                  <a-list-item-meta>
                    <template #title>
                      <a-space>
                        {{ item.id }}
                        <a-tag :color="getPriorityColor(item.priority)" size="small">
                          {{ getPriorityText(item.priority) }}
                        </a-tag>
                      </a-space>
                    </template>
                    <template #description>
                      <div>{{ item.patientNom }} {{ item.patientPrenom }}</div>
                      <div style="font-size: 12px">{{ item.type }}</div>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <right-outlined />
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>

        <!-- Détails et validation -->
        <a-col :span="16" v-if="selectedAnalysis">
          <!-- Informations -->
          <a-card title="Informations de l'Analyse" class="mb-3">
            <a-descriptions bordered :column="2">
              <a-descriptions-item label="ID">{{ selectedAnalysis.id }}</a-descriptions-item>
              <a-descriptions-item label="Type">
                <a-tag :color="getTypeColor(selectedAnalysis.type)">{{ selectedAnalysis.type }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Patient">
                {{ selectedAnalysis.patientNom }} {{ selectedAnalysis.patientPrenom }}
              </a-descriptions-item>
              <a-descriptions-item label="Date Demande">
                {{ formatDate(selectedAnalysis.requestDate) }}
              </a-descriptions-item>
              <a-descriptions-item label="Médecin">{{ selectedAnalysis.requestedBy }}</a-descriptions-item>
              <a-descriptions-item label="Technicien">{{ selectedAnalysis.technician }}</a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Résultats -->
          <a-card title="Résultats à Valider">
            <a-table
              :columns="resultsColumns"
              :data-source="resultsData"
              :pagination="false"
              size="middle"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'value'">
                  <strong>{{ record.value }}</strong> {{ record.unit }}
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="getResultStatusColor(record)">
                    {{ getResultStatusText(record) }}
                  </a-tag>
                </template>
              </template>
            </a-table>

            <a-divider />

            <a-descriptions bordered title="Observations du Technicien">
              <a-descriptions-item label="Observations" :span="3">
                {{ selectedAnalysis.observations || 'Aucune observation' }}
              </a-descriptions-item>
            </a-descriptions>

            <a-divider />

            <!-- Formulaire de validation -->
            <a-form
              :model="validationForm"
              layout="vertical"
              @finish="handleValidate"
            >
              <a-form-item label="Commentaires du Biologiste" name="comments">
                <a-textarea
                  v-model:value="validationForm.comments"
                  :rows="4"
                  placeholder="Commentaires et interprétation des résultats"
                  :maxlength="1000"
                  show-count
                />
              </a-form-item>

              <a-form-item label="Action" name="action" required>
                <a-radio-group v-model:value="validationForm.action">
                  <a-radio value="approve">
                    <check-circle-outlined style="color: #52c41a" />
                    Valider les Résultats
                  </a-radio>
                  <a-radio value="reject">
                    <close-circle-outlined style="color: #ff4d4f" />
                    Refuser (Demander une nouvelle analyse)
                  </a-radio>
                  <a-radio value="amend">
                    <edit-outlined style="color: #1890ff" />
                    Modifier avant validation
                  </a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item v-if="validationForm.action === 'reject'" label="Raison du Refus" name="rejectionReason" required>
                <a-textarea
                  v-model:value="validationForm.rejectionReason"
                  :rows="3"
                  placeholder="Expliquez pourquoi les résultats sont refusés"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>

              <a-form-item>
                <a-space>
                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="submitting"
                    :disabled="!validationForm.action"
                  >
                    <template #icon>
                      <check-outlined v-if="validationForm.action === 'approve'" />
                      <close-outlined v-else-if="validationForm.action === 'reject'" />
                      <edit-outlined v-else />
                    </template>
                    {{ getSubmitButtonText() }}
                  </a-button>
                  <a-button @click="resetValidationForm">
                    Réinitialiser
                  </a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <!-- État vide -->
        <a-col :span="16" v-else>
          <a-empty description="Sélectionnez une analyse à valider" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  RightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const submitting = ref(false);
const selectedAnalysis = ref(null);

const validationForm = reactive({
  action: undefined,
  comments: '',
  rejectionReason: '',
});

// Mock data - analyses à valider
const analysesToValidate = ref([
  {
    id: 'LAB-003',
    patientNom: 'Coulibaly',
    patientPrenom: 'Mamadou',
    type: 'Bilan Lipidique',
    priority: 'normal',
    requestDate: new Date(Date.now() - 7200000),
    requestedBy: 'Dr. Diabaté',
    technician: 'Tech. Koffi',
    observations: 'Prélèvement effectué à jeun',
  },
  {
    id: 'LAB-006',
    patientNom: 'Touré',
    patientPrenom: 'Salimata',
    type: 'Hémogramme',
    priority: 'urgent',
    requestDate: new Date(Date.now() - 5400000),
    requestedBy: 'Dr. Koné',
    technician: 'Tech. Bamba',
    observations: 'Échantillon légèrement hémolysé',
  },
]);

const resultsColumns = [
  { title: 'Paramètre', dataIndex: 'parameter', key: 'parameter' },
  { title: 'Valeur', key: 'value', width: 150 },
  { title: 'Valeurs Normales', dataIndex: 'normalRange', key: 'normalRange', width: 150 },
  { title: 'Statut', key: 'status', width: 120 },
];

const resultsData = ref([]);

const getPriorityColor = (priority) => {
  return priority === 'urgent' ? 'red' : 'blue';
};

const getPriorityText = (priority) => {
  return priority === 'urgent' ? 'Urgent' : 'Normal';
};

const getTypeColor = (type) => {
  const colors = {
    'Hémogramme': 'red',
    'Bilan Lipidique': 'blue',
  };
  return colors[type] || 'default';
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const getResultStatusColor = (record) => {
  if (record.value < record.normalMin) return 'error';
  if (record.value > record.normalMax) return 'warning';
  return 'success';
};

const getResultStatusText = (record) => {
  if (record.value < record.normalMin) return 'Bas';
  if (record.value > record.normalMax) return 'Élevé';
  return 'Normal';
};

const selectAnalysis = (analysis) => {
  selectedAnalysis.value = analysis;
  resetValidationForm();

  // Charger les résultats mockés
  if (analysis.type === 'Hémogramme') {
    resultsData.value = [
      { parameter: 'Globules Rouges', value: 4.8, unit: 'M/μL', normalRange: '4.5-5.5', normalMin: 4.5, normalMax: 5.5 },
      { parameter: 'Hémoglobine', value: 14.2, unit: 'g/dL', normalRange: '13-17', normalMin: 13, normalMax: 17 },
      { parameter: 'Hématocrite', value: 42, unit: '%', normalRange: '40-50', normalMin: 40, normalMax: 50 },
      { parameter: 'Globules Blancs', value: 7.5, unit: 'K/μL', normalRange: '4-11', normalMin: 4, normalMax: 11 },
      { parameter: 'Plaquettes', value: 250, unit: 'K/μL', normalRange: '150-400', normalMin: 150, normalMax: 400 },
    ];
  } else if (analysis.type === 'Bilan Lipidique') {
    resultsData.value = [
      { parameter: 'Cholestérol Total', value: 2.2, unit: 'g/L', normalRange: '< 2.0', normalMin: 0, normalMax: 2.0 },
      { parameter: 'HDL Cholestérol', value: 0.55, unit: 'g/L', normalRange: '> 0.40', normalMin: 0.40, normalMax: 999 },
      { parameter: 'LDL Cholestérol', value: 1.4, unit: 'g/L', normalRange: '< 1.6', normalMin: 0, normalMax: 1.6 },
      { parameter: 'Triglycérides', value: 1.1, unit: 'g/L', normalRange: '< 1.5', normalMin: 0, normalMax: 1.5 },
    ];
  }
};

const resetValidationForm = () => {
  validationForm.action = undefined;
  validationForm.comments = '';
  validationForm.rejectionReason = '';
};

const getSubmitButtonText = () => {
  if (validationForm.action === 'approve') return 'Valider les Résultats';
  if (validationForm.action === 'reject') return 'Refuser l\'Analyse';
  if (validationForm.action === 'amend') return 'Modifier';
  return 'Soumettre';
};

const handleValidate = async () => {
  if (!validationForm.action) {
    message.warning('Veuillez sélectionner une action');
    return;
  }

  if (validationForm.action === 'reject' && !validationForm.rejectionReason) {
    message.warning('Veuillez indiquer la raison du refus');
    return;
  }

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (validationForm.action === 'approve') {
      message.success('Résultats validés avec succès');
    } else if (validationForm.action === 'reject') {
      message.warning('Analyse refusée - Une nouvelle demande sera créée');
    } else {
      message.info('Redirection vers la modification');
    }

    // Retirer l'analyse de la liste
    analysesToValidate.value = analysesToValidate.value.filter(
      (a) => a.id !== selectedAnalysis.value.id
    );
    selectedAnalysis.value = null;
    resetValidationForm();
  } catch (error) {
    message.error('Erreur lors de la validation');
  } finally {
    submitting.value = false;
  }
};

// Auto-select if ID in query
if (route.query.id) {
  const analysis = analysesToValidate.value.find((a) => a.id === route.query.id);
  if (analysis) {
    selectAnalysis(analysis);
  }
}
</script>

<style scoped lang="scss">
.results-validation {
  .validation-content {
    padding: 24px;
  }

  .selected-item {
    background-color: #e6f7ff;
    border-left: 3px solid #1890ff;
  }

  .mb-3 {
    margin-bottom: 16px;
  }
}
</style>
