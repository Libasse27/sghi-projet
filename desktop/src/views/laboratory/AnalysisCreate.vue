<template>
  <div class="analysis-create">
    <a-page-header
      title="Nouvelle Demande d'Analyse"
      sub-title="Créer une demande d'analyse laboratoire"
      @back="() => $router.back()"
    />

    <div class="create-content">
      <a-card>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
          @finish="handleSubmit"
        >
          <a-row :gutter="16">
            <!-- Patient -->
            <a-col :span="24">
              <a-divider orientation="left">Informations Patient</a-divider>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Patient" name="patientId" required>
                <a-select
                  v-model:value="formState.patientId"
                  show-search
                  placeholder="Rechercher un patient"
                  :filter-option="filterPatient"
                  @change="handlePatientSelect"
                >
                  <a-select-option v-for="patient in patients" :key="patient.id" :value="patient.id">
                    {{ patient.nom }} {{ patient.prenom }} ({{ patient.id }})
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Médecin Prescripteur" name="requestedBy">
                <a-input v-model:value="formState.requestedBy" placeholder="Dr..." />
              </a-form-item>
            </a-col>

            <!-- Type d'analyse -->
            <a-col :span="24">
              <a-divider orientation="left">Type d'Analyse</a-divider>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Catégorie" name="category" required>
                <a-select v-model:value="formState.category">
                  <a-select-option value="hematologie">Hématologie</a-select-option>
                  <a-select-option value="biochimie">Biochimie</a-select-option>
                  <a-select-option value="immunologie">Immunologie</a-select-option>
                  <a-select-option value="microbiologie">Microbiologie</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Type d'Analyse" name="type" required>
                <a-select v-model:value="formState.type" mode="multiple" placeholder="Sélectionnez une ou plusieurs analyses">
                  <a-select-option value="Hémogramme">Hémogramme</a-select-option>
                  <a-select-option value="Glycémie">Glycémie</a-select-option>
                  <a-select-option value="Bilan Lipidique">Bilan Lipidique</a-select-option>
                  <a-select-option value="Bilan Rénal">Bilan Rénal</a-select-option>
                  <a-select-option value="Bilan Hépatique">Bilan Hépatique</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Priorité" name="priority" required>
                <a-radio-group v-model:value="formState.priority">
                  <a-radio value="urgent">
                    <a-tag color="red">Urgent</a-tag>
                  </a-radio>
                  <a-radio value="normal">
                    <a-tag color="blue">Normal</a-tag>
                  </a-radio>
                  <a-radio value="low">
                    <a-tag>Faible</a-tag>
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Prélèvement" name="sampleType">
                <a-select v-model:value="formState.sampleType">
                  <a-select-option value="blood">Sang</a-select-option>
                  <a-select-option value="urine">Urine</a-select-option>
                  <a-select-option value="stool">Selles</a-select-option>
                  <a-select-option value="other">Autre</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- Informations cliniques -->
            <a-col :span="24">
              <a-divider orientation="left">Informations Cliniques</a-divider>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Diagnostic Clinique" name="diagnosis">
                <a-textarea
                  v-model:value="formState.diagnosis"
                  placeholder="Diagnostic ou suspicion clinique"
                  :rows="3"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Observations" name="observations">
                <a-textarea
                  v-model:value="formState.observations"
                  placeholder="Observations complémentaires"
                  :rows="3"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>
            </a-col>

            <!-- Actions -->
            <a-col :span="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading">
                    <template #icon><save-outlined /></template>
                    Créer la Demande
                  </a-button>
                  <a-button @click="$router.back()">
                    Annuler
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SaveOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const formState = reactive({
  patientId: undefined,
  requestedBy: '',
  category: undefined,
  type: [],
  priority: 'normal',
  sampleType: 'blood',
  diagnosis: '',
  observations: '',
});

const rules = {
  patientId: [{ required: true, message: 'Veuillez sélectionner un patient' }],
  category: [{ required: true, message: 'Veuillez sélectionner une catégorie' }],
  type: [{ required: true, message: 'Veuillez sélectionner au moins une analyse', type: 'array', min: 1 }],
  priority: [{ required: true, message: 'Veuillez sélectionner une priorité' }],
};

// Mock patients data
const patients = ref([
  { id: 'P-2024-001', nom: 'Diallo', prenom: 'Amadou' },
  { id: 'P-2024-002', nom: 'Traoré', prenom: 'Aïssata' },
  { id: 'P-2024-003', nom: 'Coulibaly', prenom: 'Mamadou' },
]);

const filterPatient = (input, option) => {
  return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handlePatientSelect = (patientId) => {
  console.log('Patient sélectionné:', patientId);
};

const handleSubmit = async (values) => {
  loading.value = true;
  try {
    // Simuler l'appel API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success('Demande d\'analyse créée avec succès');
    router.push('/laboratory/list');
  } catch (error) {
    message.error('Erreur lors de la création de la demande');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.analysis-create {
  .create-content {
    padding: 24px;
  }
}
</style>
