<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <medicine-box-outlined :style="{ fontSize: '48px', color: '#2C7A7B' }" />
        </div>
        <h1>SGHI</h1>
        <p class="subtitle">Système de Gestion Hospitalière Intégré</p>
      </div>

      <a-form
        :model="loginForm"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
      >
        <a-form-item label="Email" name="email">
          <a-input
            v-model:value="loginForm.email"
            size="large"
            placeholder="Entrez votre email"
            :prefix="h(UserOutlined)"
          />
        </a-form-item>

        <a-form-item label="Mot de passe" name="password">
          <a-input-password
            v-model:value="loginForm.password"
            size="large"
            placeholder="Entrez votre mot de passe"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item>
          <div class="form-options">
            <a-checkbox v-model:checked="loginForm.remember">
              Se souvenir de moi
            </a-checkbox>
            <a href="#" class="forgot-password">Mot de passe oublié ?</a>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            Se connecter
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <p>Version {{ appVersion }}</p>
      </div>
    </div>

    <div class="login-background">
      <div class="background-overlay"></div>
    </div>
  </div>
</template>

<script setup>
import { h, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const appVersion = ref('1.0.0');

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
});

const rules = {
  email: [
    { required: true, message: 'Veuillez saisir votre email', trigger: 'blur' },
    { type: 'email', message: 'Email invalide', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Veuillez saisir votre mot de passe', trigger: 'blur' },
    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  loading.value = true;

  try {
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
    });

    message.success('Connexion réussie !');
    router.push('/');
  } catch (error) {
    console.error('Login error:', error);
    message.error(error.response?.data?.message || 'Email ou mot de passe incorrect');
  } finally {
    loading.value = false;
  }
};

// Vérifier si l'API Electron est disponible
if (window.electronAPI) {
  appVersion.value = window.electronAPI.getAppVersion();
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: bottom;
  z-index: 0;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.login-box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo {
    margin-bottom: 16px;
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2C7A7B;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #718096;
    font-size: 14px;
  }
}

.login-form {
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .forgot-password {
      color: #2C7A7B;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: #A0AEC0;
  font-size: 12px;
}
</style>
