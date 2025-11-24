<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Logo et Header -->
      <div class="auth-header">
        <div class="logo-container">
          <div class="logo-placeholder">SGHI</div>
        </div>
        <h1 class="title">Mot de passe oublié ?</h1>
        <p class="subtitle">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <!-- Email envoyé avec succès -->
      <div v-if="emailSent" class="success-message">
        <a-result
          status="success"
          title="Email envoyé !"
          :sub-title="`Un email de réinitialisation a été envoyé à ${formState.email}`"
        >
          <template #extra>
            <a-button type="primary" size="large" @click="router.push('/auth/login')">
              Retour à la connexion
            </a-button>
          </template>
        </a-result>
      </div>

      <!-- Formulaire -->
      <a-form
        v-else
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleForgotPassword"
        class="auth-form"
      >
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

        <!-- Bouton d'envoi -->
        <a-form-item class="submit-button">
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
          >
            <template #icon><SendOutlined /></template>
            Envoyer le lien
          </a-button>
        </a-form-item>

        <!-- Lien retour -->
        <div class="back-link">
          <router-link to="/auth/login">
            <ArrowLeftOutlined /> Retour à la connexion
          </router-link>
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
  MailOutlined,
  SendOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons-vue';
import authService from '@/services/auth.service';

const router = useRouter();

// État du formulaire
const formState = reactive({
  email: '',
});

const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

// Règles de validation
const rules = {
  email: [
    { required: true, message: 'L\'email est requis' },
    { type: 'email', message: 'Email invalide' },
  ],
};

// Gestion de la réinitialisation
const handleForgotPassword = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authService.forgotPassword(formState.email);
    emailSent.value = true;
    message.success('Email de réinitialisation envoyé !');
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Une erreur est survenue lors de l\'envoi de l\'email';
    console.error('Forgot password error:', err);
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
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  width: 100%;
  max-width: 440px;
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
    line-height: 1.5;
  }
}

.success-message {
  :deep(.ant-result-title) {
    color: #2d3748;
  }

  :deep(.ant-btn-primary) {
    background: linear-gradient(135deg, #2c7a7b 0%, #319795 100%);
    border: none;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
  }
}

.auth-form {
  .error-alert {
    margin-bottom: 24px;
  }

  .submit-button {
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

  .back-link {
    text-align: center;

    a {
      color: #2c7a7b;
      font-weight: 600;
      transition: color 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;

      &:hover {
        color: #319795;
      }
    }
  }
}

// Input styles
:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 8px;
  padding: 12px;
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
