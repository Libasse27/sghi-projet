<template>
  <div class="consultation-create">
    <a-page-header
      title="Nouvelle Consultation"
      sub-title="Créer une consultation médicale"
      @back="() => $router.back()"
    />

    <div class="create-content">
      <a-card>
        <a-form
          :model="formState"
          layout="vertical"
          @finish="handleSubmit"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-divider orientation="left">Informations Générales</a-divider>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Patient" name="patientId" required>
                <a-select
                  v-model:value="formState.patientId"
                  show-search
                  placeholder="Rechercher un patient"
                >
                  <a-select-option v-for="patient in patients" :key="patient.id" :value="patient.id">
                    {{ patient.nom }} {{ patient.prenom }} ({{ patient.id }})
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Médecin" name="medecin" required>
                <a-select v-model:value="formState.medecin">
                  <a-select-option value="Dr. Koné">Dr. Koné</a-select-option>
                  <a-select-option value="Dr. Sanogo">Dr. Sanogo</a-select-option>
                  <a-select-option value="Dr. Diabaté">Dr. Diabaté</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Date et Heure" name="date" required>
                <a-date-picker
                  v-model:value="formState.date"
                  show-time
                  format="DD/MM/YYYY HH:mm"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Type" name="type" required>
                <a-select v-model:value="formState.type">
                  <a-select-option value="Consultation">Consultation</a-select-option>
                  <a-select-option value="Contrôle">Contrôle</a-select-option>
                  <a-select-option value="Urgence">Urgence</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Motif de Consultation" name="motif" required>
                <a-textarea
                  v-model:value="formState.motif"
                  :rows="3"
                  placeholder="Raison de la consultation"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-divider orientation="left">Constantes Vitales</a-divider>
            </a-col>

            <a-col :xs="12" :md="6">
              <a-form-item label="Tension (mmHg)">
                <a-input v-model:value="formState.tension" placeholder="120/80" />
              </a-form-item>
            </a-col>

            <a-col :xs="12" :md="6">
              <a-form-item label="Poids (kg)">
                <a-input-number v-model:value="formState.poids" :min="0" :max="300" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :xs="12" :md="6">
              <a-form-item label="Température (°C)">
                <a-input-number v-model:value="formState.temperature" :min="30" :max="45" :precision="1" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :xs="12" :md="6">
              <a-form-item label="Fréq. Cardiaque">
                <a-input-number v-model:value="formState.frequenceCardiaque" :min="30" :max="200" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-divider orientation="left">Observations</a-divider>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Notes">
                <a-textarea
                  v-model:value="formState.notes"
                  :rows="4"
                  placeholder="Notes et observations"
                  :maxlength="1000"
                  show-count
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading">
                    <template #icon><save-outlined /></template>
                    Créer la Consultation
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { SaveOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const loading = ref(false);

const formState = reactive({
  patientId: route.query.patientId || undefined,
  medecin: '',
  date: null,
  type: 'Consultation',
  motif: '',
  tension: '',
  poids: null,
  temperature: null,
  frequenceCardiaque: null,
  notes: '',
});

const patients = ref([
  { id: 'P-2024-001', nom: 'Diallo', prenom: 'Amadou' },
  { id: 'P-2024-002', nom: 'Traoré', prenom: 'Aïssata' },
]);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success('Consultation créée avec succès');
    router.push('/consultations');
  } catch (error) {
    message.error('Erreur lors de la création');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  formState.date = new Date();
});
</script>

<style scoped lang="scss">
.consultation-create {
  .create-content {
    padding: 24px;
  }
}
</style>
