<template>
  <div class="patient-create-view">
    <a-page-header
      title="Nouveau patient"
      sub-title="Enregistrement d'un nouveau patient"
      @back="$router.back()"
    />

    <a-card :bordered="false" style="margin-top: 16px">
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-row :gutter="24">
          <a-col :xs="24" :md="12">
            <a-form-item label="Nom" name="nom">
              <a-input v-model:value="formState.nom" size="large" placeholder="Nom de famille" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="Prénom" name="prenom">
              <a-input v-model:value="formState.prenom" size="large" placeholder="Prénom" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :xs="24" :md="8">
            <a-form-item label="Date de naissance" name="dateNaissance">
              <a-date-picker
                v-model:value="formState.dateNaissance"
                size="large"
                style="width: 100%"
                placeholder="JJ/MM/AAAA"
                format="DD/MM/YYYY"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="Sexe" name="sexe">
              <a-select v-model:value="formState.sexe" size="large" placeholder="Sélectionner">
                <a-select-option value="M">Masculin</a-select-option>
                <a-select-option value="F">Féminin</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item label="Groupe sanguin" name="groupeSanguin">
              <a-select v-model:value="formState.groupeSanguin" size="large" placeholder="Sélectionner">
                <a-select-option value="A+">A+</a-select-option>
                <a-select-option value="A-">A-</a-select-option>
                <a-select-option value="B+">B+</a-select-option>
                <a-select-option value="B-">B-</a-select-option>
                <a-select-option value="AB+">AB+</a-select-option>
                <a-select-option value="AB-">AB-</a-select-option>
                <a-select-option value="O+">O+</a-select-option>
                <a-select-option value="O-">O-</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :xs="24" :md="12">
            <a-form-item label="Téléphone" name="telephone">
              <a-input v-model:value="formState.telephone" size="large" placeholder="+221 XX XXX XX XX" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="Email" name="email">
              <a-input v-model:value="formState.email" size="large" placeholder="email@example.com" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Adresse" name="adresse">
          <a-textarea
            v-model:value="formState.adresse"
            :rows="3"
            placeholder="Adresse complète du patient"
          />
        </a-form-item>

        <a-divider />

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" size="large" :loading="loading">
              <template #icon><save-outlined /></template>
              Enregistrer
            </a-button>
            <a-button size="large" @click="$router.back()">
              Annuler
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SaveOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  nom: '',
  prenom: '',
  dateNaissance: null,
  sexe: undefined,
  groupeSanguin: undefined,
  telephone: '',
  email: '',
  adresse: '',
});

const rules = {
  nom: [{ required: true, message: 'Le nom est requis' }],
  prenom: [{ required: true, message: 'Le prénom est requis' }],
  dateNaissance: [{ required: true, message: 'La date de naissance est requise' }],
  sexe: [{ required: true, message: 'Le sexe est requis' }],
  telephone: [{ required: true, message: 'Le téléphone est requis' }],
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Appel API pour créer le patient
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success('Patient enregistré avec succès');
    router.push('/patients');
  } catch (error) {
    message.error('Erreur lors de l\'enregistrement');
  } finally {
    loading.value = false;
  }
};
</script>
