<template>
  <div class="patient-edit">
    <a-page-header
      :title="`Modifier - ${patient?.nom} ${patient?.prenom}`"
      :sub-title="`ID: ${$route.params.id}`"
      @back="() => $router.back()"
    />

    <div class="edit-content" v-if="patient">
      <a-card>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
          @finish="handleSubmit"
        >
          <a-row :gutter="16">
            <!-- Same form fields as PatientCreate -->
            <a-col :span="24">
              <a-divider orientation="left">Informations Personnelles</a-divider>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Nom" name="nom" required>
                <a-input v-model:value="formState.nom" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Prénom" name="prenom" required>
                <a-input v-model:value="formState.prenom" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Date de Naissance" name="dateNaissance" required>
                <a-date-picker
                  v-model:value="formState.dateNaissance"
                  format="DD/MM/YYYY"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Sexe" name="sexe" required>
                <a-radio-group v-model:value="formState.sexe">
                  <a-radio value="M">Masculin</a-radio>
                  <a-radio value="F">Féminin</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="12">
              <a-form-item label="Groupe Sanguin" name="groupeSanguin">
                <a-select v-model:value="formState.groupeSanguin">
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
            </a-col>

            <a-col :span="24">
              <a-divider orientation="left">Contact</a-divider>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Téléphone" name="telephone" required>
                <a-input v-model:value="formState.telephone" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Email" name="email">
                <a-input v-model:value="formState.email" type="email" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Profession" name="profession">
                <a-input v-model:value="formState.profession" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Adresse" name="adresse" required>
                <a-textarea v-model:value="formState.adresse" :rows="2" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-divider orientation="left">Antécédents Médicaux</a-divider>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Allergies" name="allergies">
                <a-textarea v-model:value="formState.allergies" :rows="2" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Maladies Chroniques" name="maladiesChroniques">
                <a-textarea v-model:value="formState.maladiesChroniques" :rows="2" />
              </a-form-item>
            </a-col>

            <!-- Actions -->
            <a-col :span="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading">
                    <template #icon><save-outlined /></template>
                    Enregistrer les Modifications
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
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();
const formRef = ref();
const loading = ref(false);

const patient = ref(null);

const formState = reactive({
  nom: '',
  prenom: '',
  dateNaissance: null,
  sexe: 'M',
  groupeSanguin: undefined,
  telephone: '',
  email: '',
  profession: '',
  adresse: '',
  allergies: '',
  maladiesChroniques: '',
});

const rules = {
  nom: [{ required: true, message: 'Le nom est obligatoire' }],
  prenom: [{ required: true, message: 'Le prénom est obligatoire' }],
  dateNaissance: [{ required: true, message: 'La date de naissance est obligatoire' }],
  sexe: [{ required: true, message: 'Le sexe est obligatoire' }],
  telephone: [{ required: true, message: 'Le téléphone est obligatoire' }],
  adresse: [{ required: true, message: 'L\'adresse est obligatoire' }],
};

const loadPatient = () => {
  // Mock data
  patient.value = {
    id: route.params.id,
    nom: 'Diallo',
    prenom: 'Amadou',
    dateNaissance: dayjs('1979-05-15'),
    sexe: 'M',
    telephone: '+223 70 12 34 56',
    email: 'amadou.diallo@email.com',
    adresse: 'Bamako, Badalabougou',
    groupeSanguin: 'A+',
    profession: 'Enseignant',
    allergies: 'Pénicilline',
    maladiesChroniques: 'Hypertension',
  };

  // Populate form
  Object.assign(formState, patient.value);
};

const handleSubmit = async (values) => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success('Patient modifié avec succès');
    router.push(`/patients/${route.params.id}`);
  } catch (error) {
    message.error('Erreur lors de la modification');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPatient();
});
</script>

<style scoped lang="scss">
.patient-edit {
  .edit-content {
    padding: 24px;
  }
}
</style>
