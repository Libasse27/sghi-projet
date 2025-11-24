<template>
  <div class="triage-view">
    <a-page-header
      title="Triage des Urgences"
      sub-title="Évaluation et classification des patients"
      @back="router.back()"
    >
      <template #extra>
        <a-button @click="resetForm">
          <template #icon><ReloadOutlined /></template>
          Réinitialiser
        </a-button>
      </template>
    </a-page-header>

    <div class="triage-content">
      <a-row :gutter="24">
        <!-- Formulaire de triage -->
        <a-col :xs="24" :lg="16">
          <a-card title="Informations du patient" class="triage-form-card">
            <a-form
              :model="formState"
              :rules="rules"
              layout="vertical"
              @finish="handleSubmit"
            >
              <!-- Recherche ou nouveau patient -->
              <a-form-item label="Patient" name="patientId">
                <a-select
                  v-model:value="formState.patientId"
                  show-search
                  placeholder="Rechercher un patient existant"
                  :filter-option="filterPatient"
                  :options="patientOptions"
                  size="large"
                  @change="handlePatientSelect"
                >
                  <template #suffixIcon>
                    <SearchOutlined />
                  </template>
                </a-select>
                <a-button
                  type="link"
                  @click="showNewPatientModal = true"
                  style="padding: 0; margin-top: 8px"
                >
                  + Nouveau patient
                </a-button>
              </a-form-item>

              <!-- Motif de consultation -->
              <a-form-item label="Motif de consultation" name="reason">
                <a-textarea
                  v-model:value="formState.reason"
                  placeholder="Décrivez le motif de la consultation"
                  :rows="3"
                  show-count
                  :maxlength="500"
                />
              </a-form-item>

              <!-- Constantes vitales -->
              <a-divider orientation="left">Constantes vitales</a-divider>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Tension artérielle" name="bloodPressure">
                    <a-input
                      v-model:value="formState.vitals.bloodPressure"
                      placeholder="120/80"
                      size="large"
                    >
                      <template #suffix>mmHg</template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Fréquence cardiaque" name="heartRate">
                    <a-input-number
                      v-model:value="formState.vitals.heartRate"
                      placeholder="70"
                      :min="0"
                      :max="300"
                      size="large"
                      style="width: 100%"
                    >
                      <template #addonAfter>bpm</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Température" name="temperature">
                    <a-input-number
                      v-model:value="formState.vitals.temperature"
                      placeholder="37.0"
                      :min="30"
                      :max="45"
                      :step="0.1"
                      size="large"
                      style="width: 100%"
                    >
                      <template #addonAfter>°C</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Fréquence respiratoire" name="respiratoryRate">
                    <a-input-number
                      v-model:value="formState.vitals.respiratoryRate"
                      placeholder="16"
                      :min="0"
                      :max="100"
                      size="large"
                      style="width: 100%"
                    >
                      <template #addonAfter>/min</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Saturation O₂" name="oxygenSaturation">
                    <a-input-number
                      v-model:value="formState.vitals.oxygenSaturation"
                      placeholder="98"
                      :min="0"
                      :max="100"
                      size="large"
                      style="width: 100%"
                    >
                      <template #addonAfter>%</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Glycémie" name="bloodSugar">
                    <a-input-number
                      v-model:value="formState.vitals.bloodSugar"
                      placeholder="1.0"
                      :min="0"
                      :max="10"
                      :step="0.1"
                      size="large"
                      style="width: 100%"
                    >
                      <template #addonAfter>g/L</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- Échelle de douleur -->
              <a-form-item label="Échelle de douleur (0-10)" name="painScale">
                <a-slider
                  v-model:value="formState.painScale"
                  :min="0"
                  :max="10"
                  :marks="painMarks"
                  :tooltip-visible="true"
                />
              </a-form-item>

              <!-- État de conscience -->
              <a-form-item label="État de conscience" name="consciousness">
                <a-radio-group v-model:value="formState.consciousness" size="large">
                  <a-radio-button value="alert">Alerte</a-radio-button>
                  <a-radio-button value="confused">Confus</a-radio-button>
                  <a-radio-button value="drowsy">Somnolent</a-radio-button>
                  <a-radio-button value="unconscious">Inconscient</a-radio-button>
                </a-radio-group>
              </a-form-item>

              <!-- Observations supplémentaires -->
              <a-form-item label="Observations supplémentaires" name="observations">
                <a-textarea
                  v-model:value="formState.observations"
                  placeholder="Notes additionnelles sur l'état du patient"
                  :rows="4"
                  show-count
                  :maxlength="1000"
                />
              </a-form-item>

              <!-- Boutons d'action -->
              <a-form-item>
                <a-space>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    :loading="submitting"
                  >
                    <template #icon><SaveOutlined /></template>
                    Enregistrer et attribuer priorité
                  </a-button>
                  <a-button size="large" @click="router.back()">
                    Annuler
                  </a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <!-- Guide de classification -->
        <a-col :xs="24" :lg="8">
          <a-card title="Guide de classification" class="priority-guide">
            <div
              v-for="level in priorityLevels"
              :key="level.code"
              class="priority-level"
              :class="`priority-${level.code.toLowerCase()}`"
            >
              <div class="priority-header">
                <a-tag :color="level.color" class="priority-tag">
                  {{ level.code }}
                </a-tag>
                <span class="priority-name">{{ level.name }}</span>
              </div>
              <div class="priority-description">{{ level.description }}</div>
              <div class="priority-time">
                <ClockCircleOutlined />
                Délai max: {{ level.maxWaitTime }}
              </div>
              <div class="priority-examples">
                <strong>Exemples:</strong>
                <ul>
                  <li v-for="(example, idx) in level.examples" :key="idx">
                    {{ example }}
                  </li>
                </ul>
              </div>
            </div>
          </a-card>

          <!-- Algorithme suggéré -->
          <a-card
            title="Priorité suggérée"
            class="suggested-priority"
            v-if="suggestedPriority"
          >
            <a-result
              :status="suggestedPriority.status"
              :title="suggestedPriority.code"
              :sub-title="suggestedPriority.reason"
            >
              <template #icon>
                <component :is="suggestedPriority.icon" />
              </template>
            </a-result>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Modal nouveau patient -->
    <a-modal
      v-model:open="showNewPatientModal"
      title="Nouveau patient"
      width="600px"
      @ok="handleCreatePatient"
    >
      <p>Formulaire rapide pour créer un nouveau patient...</p>
      <!-- TODO: Ajouter formulaire complet -->
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();

// État
const submitting = ref(false);
const showNewPatientModal = ref(false);

// Formulaire
const formState = reactive({
  patientId: undefined,
  reason: '',
  vitals: {
    bloodPressure: '',
    heartRate: null,
    temperature: null,
    respiratoryRate: null,
    oxygenSaturation: null,
    bloodSugar: null,
  },
  painScale: 0,
  consciousness: 'alert',
  observations: '',
});

// Règles de validation
const rules = {
  patientId: [{ required: true, message: 'Veuillez sélectionner un patient' }],
  reason: [{ required: true, message: 'Le motif est requis' }],
};

// Options patients (mock)
const patientOptions = ref([
  { label: 'Diallo Amadou - 45 ans (M)', value: '1' },
  { label: 'Ndiaye Fatou - 32 ans (F)', value: '2' },
  { label: 'Sow Mariama - 28 ans (F)', value: '3' },
]);

// Échelle de douleur
const painMarks = {
  0: '0',
  2: '2',
  4: '4',
  6: '6',
  8: '8',
  10: '10',
};

// Niveaux de priorité
const priorityLevels = [
  {
    code: 'P1',
    name: 'Urgence Absolue',
    color: 'red',
    description: 'Danger de mort immédiat',
    maxWaitTime: 'Immédiat',
    examples: [
      'Arrêt cardiaque',
      'Détresse respiratoire sévère',
      'Hémorragie massive',
      'AVC aigu',
    ],
  },
  {
    code: 'P2',
    name: 'Urgence Relative',
    color: 'orange',
    description: 'Risque vital à court terme',
    maxWaitTime: '20 minutes',
    examples: [
      'Douleur thoracique',
      'Traumatisme crânien',
      'Fracture ouverte',
      'Brûlure étendue',
    ],
  },
  {
    code: 'P3',
    name: 'Urgence Non Vitale',
    color: 'gold',
    description: 'État stable mais nécessite des soins',
    maxWaitTime: '60 minutes',
    examples: [
      'Fièvre élevée',
      'Douleur abdominale',
      'Fracture simple',
      'Plaie profonde',
    ],
  },
  {
    code: 'P4',
    name: 'Soins Rapides',
    color: 'green',
    description: 'Problème mineur',
    maxWaitTime: '120 minutes',
    examples: [
      'Entorse',
      'Plaie superficielle',
      'Rhinopharyngite',
      'Céphalée simple',
    ],
  },
  {
    code: 'P5',
    name: 'Consultation',
    color: 'blue',
    description: 'Pas d\'urgence',
    maxWaitTime: '240 minutes',
    examples: [
      'Renouvellement ordonnance',
      'Certificat médical',
      'Conseil médical',
      'Problème chronique stable',
    ],
  },
];

// Priorité suggérée (calculée)
const suggestedPriority = computed(() => {
  // Algorithme simple basé sur les constantes
  const vitals = formState.vitals;

  // Vérifier les signes critiques
  if (
    formState.consciousness === 'unconscious' ||
    (vitals.heartRate && (vitals.heartRate < 40 || vitals.heartRate > 140)) ||
    (vitals.oxygenSaturation && vitals.oxygenSaturation < 90)
  ) {
    return {
      code: 'P1 - Urgence Absolue',
      reason: 'Signes vitaux critiques détectés',
      status: 'error',
      icon: WarningOutlined,
    };
  }

  // Vérifier douleur intense
  if (formState.painScale >= 8) {
    return {
      code: 'P2 - Urgence Relative',
      reason: 'Douleur intense (≥8/10)',
      status: 'warning',
      icon: WarningOutlined,
    };
  }

  // Par défaut
  return null;
});

// Méthodes
const filterPatient = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handlePatientSelect = (value) => {
  console.log('Patient selected:', value);
  // TODO: Charger les infos du patient
};

const resetForm = () => {
  Object.assign(formState, {
    patientId: undefined,
    reason: '',
    vitals: {
      bloodPressure: '',
      heartRate: null,
      temperature: null,
      respiratoryRate: null,
      oxygenSaturation: null,
      bloodSugar: null,
    },
    painScale: 0,
    consciousness: 'alert',
    observations: '',
  });
  message.info('Formulaire réinitialisé');
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    // TODO: Envoyer à l'API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success('Triage enregistré avec succès');
    router.push('/emergency');
  } catch (error) {
    message.error('Erreur lors de l\'enregistrement');
  } finally {
    submitting.value = false;
  }
};

const handleCreatePatient = () => {
  showNewPatientModal.value = false;
  message.success('Patient créé');
  // TODO: Implémenter création patient
};
</script>

<style scoped lang="scss">
.triage-view {
  .triage-content {
    padding: 24px;
  }

  .triage-form-card {
    margin-bottom: 24px;
  }

  .priority-guide {
    margin-bottom: 24px;
    position: sticky;
    top: 24px;

    .priority-level {
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 2px solid;

      &.priority-p1 {
        border-color: #dc2626;
        background: #fef2f2;
      }

      &.priority-p2 {
        border-color: #f59e0b;
        background: #fffbeb;
      }

      &.priority-p3 {
        border-color: #eab308;
        background: #fefce8;
      }

      &.priority-p4 {
        border-color: #22c55e;
        background: #f0fdf4;
      }

      &.priority-p5 {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .priority-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .priority-tag {
          font-weight: bold;
          font-size: 14px;
        }

        .priority-name {
          margin-left: 8px;
          font-weight: 600;
          color: #2d3748;
        }
      }

      .priority-description {
        color: #4a5568;
        font-size: 13px;
        margin-bottom: 8px;
      }

      .priority-time {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #718096;
        font-size: 12px;
        margin-bottom: 12px;
      }

      .priority-examples {
        font-size: 12px;

        strong {
          color: #2d3748;
        }

        ul {
          margin: 4px 0 0 16px;
          padding: 0;

          li {
            color: #4a5568;
            margin: 2px 0;
          }
        }
      }
    }
  }

  .suggested-priority {
    position: sticky;
    top: calc(100vh - 300px);

    :deep(.ant-result) {
      padding: 16px 0;
    }
  }
}
</style>
