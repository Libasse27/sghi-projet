<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Logo et Header -->
      <div class="auth-header">
        <div class="logo-container">
          <div class="logo-placeholder">SGHI</div>
        </div>
        <h1 class="title">Créer un compte</h1>
        <p class="subtitle">Inscrivez-vous pour accéder à l'application</p>
      </div>

      <!-- Formulaire d'inscription -->
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleRegister"
        class="auth-form"
      >
        <!-- Nom et Prénom -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Nom" name="nom">
              <a-input
                v-model:value="formState.nom"
                size="large"
                placeholder="Nom"
                :prefix="h(UserOutlined)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Prénom" name="prenom">
              <a-input
                v-model:value="formState.prenom"
                size="large"
                placeholder="Prénom"
                :prefix="h(UserOutlined)"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Email -->
        <a-form-item label="Email" name="email">
          <a-input
            v-model:value="formState.email"
            size="large"
            placeholder="votre.email@example.com"
            :prefix="h(MailOutlined)"
            autocomplete="email"
          />
        </a-form-item>

        <!-- Téléphone -->
        <a-form-item label="Téléphone" name="telephone">
          <a-input
            v-model:value="formState.telephone"
            size="large"
            placeholder="+221 XX XXX XX XX"
            :prefix="h(PhoneOutlined)"
          />
        </a-form-item>

        <!-- Date de naissance et Sexe -->
        <a-row :gutter="16">
          <a-col :span="12">
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
          <a-col :span="12">
            <a-form-item label="Sexe" name="sexe">
              <a-select
                v-model:value="formState.sexe"
                size="large"
                placeholder="Sélectionner"
              >
                <a-select-option value="M">Homme</a-select-option>
                <a-select-option value="F">Femme</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Mot de passe -->
        <a-form-item label="Mot de passe" name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="••••••••"
            :prefix="h(LockOutlined)"
            autocomplete="new-password"
          />
        </a-form-item>

        <!-- Confirmation mot de passe -->
        <a-form-item label="Confirmer le mot de passe" name="confirmPassword">
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            placeholder="••••••••"
            :prefix="h(LockOutlined)"
            autocomplete="new-password"
          />
        </a-form-item>

        <!-- Message d'erreur -->
        <a-alert
          v-if="error"
          :message="error"
          type="error"
          show-icon
          closable
          @close="error = ''"
          class="error-alert"
        />

        <!-- Bouton d'inscription -->
        <a-form-item class="submit-button">
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
          >
            <template #icon><UserAddOutlined /></template>
            S'inscrire
          </a-button>
        </a-form-item>

        <!-- Lien de connexion -->
        <div class="login-link">
          Déjà un compte ?
          <router-link to="/auth/login">Se connecter</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserAddOutlined,
} from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/auth';
import dayjs from 'dayjs';

const router = useRouter();
const authStore = useAuthStore();

// État du formulaire
const formState = reactive({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: null,
  sexe: undefined,
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

// Validation personnalisée pour la confirmation du mot de passe
const validateConfirmPassword = async (_rule, value) => {
  if (!value) {
    return Promise.reject('Veuillez confirmer votre mot de passe');
  }
  if (value !== formState.password) {
    return Promise.reject('Les mots de passe ne correspondent pas');
  }
  return Promise.resolve();
};

// Règles de validation
const rules = {
  nom: [{ required: true, message: 'Le nom est requis' }],
  prenom: [{ required: true, message: 'Le prénom est requis' }],
  email: [
    { required: true, message: 'L\'email est requis' },
    { type: 'email', message: 'Email invalide' },
  ],
  telephone: [
    { required: true, message: 'Le téléphone est requis' },
    {
      pattern: /^(\+221|221)?[0-9]{9}$/,
      message: 'Numéro de téléphone invalide',
    },
  ],
  dateNaissance: [
    { required: true, message: 'La date de naissance est requise' },
  ],
  sexe: [{ required: true, message: 'Le sexe est requis' }],
  password: [
    { required: true, message: 'Le mot de passe est requis' },
    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
  ],
  confirmPassword: [
    { required: true, message: 'Veuillez confirmer votre mot de passe' },
    { validator: validateConfirmPassword },
  ],
};

// Gestion de l'inscription
const handleRegister = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Formater la date pour l'API
    const registrationData = {
      ...formState,
      dateNaissance: formState.dateNaissance
        ? dayjs(formState.dateNaissance).format('YYYY-MM-DD')
        : null,
    };

    delete registrationData.confirmPassword;

    await authStore.register(registrationData);

    message.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    router.push('/auth/login');
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Une erreur est survenue lors de l\'inscription';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c7a7b 0%, #319795 100%);
  padding: 20px;
  overflow-y: auto;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-container {
    margin-bottom: 24px;

    .logo-placeholder {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      background: linear-gradient(135deg, #2c7a7b 0%, #319795 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 2px;
    }
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 16px;
    color: #718096;
  }
}

.auth-form {
  .error-alert {
    margin-bottom: 24px;
  }

  .submit-button {
    margin-top: 8px;
    margin-bottom: 16px;

    :deep(.ant-btn-primary) {
      background: linear-gradient(135deg, #2c7a7b 0%, #319795 100%);
      border: none;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(44, 122, 123, 0.3);
      }
    }
  }

  .login-link {
    text-align: center;
    color: #718096;
    font-size: 14px;

    a {
      color: #2c7a7b;
      font-weight: 600;
      margin-left: 4px;
      transition: color 0.3s;

      &:hover {
        color: #319795;
      }
    }
  }
}

// Input styles
:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-picker),
:deep(.ant-select-selector) {
  border-radius: 8px;
}

:deep(.ant-input),
:deep(.ant-picker input) {
  font-size: 15px;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  padding: 8px 12px;

  .ant-input {
    padding: 4px 0;
  }
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #2d3748;
}
</style>
