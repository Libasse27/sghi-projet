<template>
  <div class="patient-create">
    <a-page-header
      title="Nouveau Patient"
      sub-title="Enregistrer un nouveau patient"
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
            <!-- Informations Personnelles -->
            <a-col :span="24">
              <a-divider orientation="left">Informations Personnelles</a-divider>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Nom" name="nom" required>
                <a-input v-model:value="formState.nom" placeholder="Nom de famille" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Prénom" name="prenom" required>
                <a-input v-model:value="formState.prenom" placeholder="Prénom" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Date de Naissance" name="dateNaissance" required>
                <a-date-picker
                  v-model:value="formState.dateNaissance"
                  format="DD/MM/YYYY"
                  placeholder="JJ/MM/AAAA"
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
                <a-select v-model:value="formState.groupeSanguin" placeholder="Sélectionner">
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

            <!-- Contact -->
            <a-col :span="24">
              <a-divider orientation="left">Contact</a-divider>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Téléphone" name="telephone" required>
                <a-input v-model:value="formState.telephone" placeholder="+223 XX XX XX XX" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Email" name="email">
                <a-input v-model:value="formState.email" type="email" placeholder="email@exemple.com" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Profession" name="profession">
                <a-input v-model:value="formState.profession" placeholder="Profession" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Adresse" name="adresse" required>
                <a-textarea v-model:value="formState.adresse" :rows="2" placeholder="Adresse complète" />
              </a-form-item>
            </a-col>

            <!-- Antécédents Médicaux -->
            <a-col :span="24">
              <a-divider orientation="left">Antécédents Médicaux</a-divider>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Allergies" name="allergies">
                <a-textarea v-model:value="formState.allergies" :rows="2" placeholder="Liste des allergies connues" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="Maladies Chroniques" name="maladiesChroniques">
                <a-textarea v-model:value="formState.maladiesChroniques" :rows="2" placeholder="Maladies chroniques" />
              </a-form-item>
            </a-col>

            <!-- Contact d'Urgence -->
            <a-col :span="24">
              <a-divider orientation="left">Contact d'Urgence</a-divider>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Nom du Contact" name="contactUrgenceNom">
                <a-input v-model:value="formState.contactUrgenceNom" placeholder="Nom complet" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Téléphone" name="contactUrgenceTelephone">
                <a-input v-model:value="formState.contactUrgenceTelephone" placeholder="+223 XX XX XX XX" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :md="8">
              <a-form-item label="Lien" name="contactUrgenceLien">
                <a-select v-model:value="formState.contactUrgenceLien" placeholder="Relation">
                  <a-select-option value="Époux(se)">Époux(se)</a-select-option>
                  <a-select-option value="Parent">Parent</a-select-option>
                  <a-select-option value="Enfant">Enfant</a-select-option>
                  <a-select-option value="Frère/Sœur">Frère/Sœur</a-select-option>
                  <a-select-option value="Ami(e)">Ami(e)</a-select-option>
                  <a-select-option value="Autre">Autre</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- Actions -->
            <a-col :span="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading">
                    <template #icon><save-outlined /></template>
                    Enregistrer le Patient
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
  contactUrgenceNom: '',
  contactUrgenceTelephone: '',
  contactUrgenceLien: undefined,
});

const rules = {
  nom: [{ required: true, message: 'Le nom est obligatoire' }],
  prenom: [{ required: true, message: 'Le prénom est obligatoire' }],
  dateNaissance: [{ required: true, message: 'La date de naissance est obligatoire' }],
  sexe: [{ required: true, message: 'Le sexe est obligatoire' }],
  telephone: [
    { required: true, message: 'Le téléphone est obligatoire' },
    { pattern: /^[\d\s+()-]+$/, message: 'Numéro de téléphone invalide' },
  ],
  email: [
    { type: 'email', message: 'Email invalide' },
  ],
  adresse: [{ required: true, message: 'L\'adresse est obligatoire' }],
};

const handleSubmit = async (values) => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success('Patient enregistré avec succès');
    router.push('/patients');
  } catch (error) {
    message.error('Erreur lors de l\'enregistrement');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.patient-create {
  .create-content {
    padding: 24px;
  }
}
</style>
