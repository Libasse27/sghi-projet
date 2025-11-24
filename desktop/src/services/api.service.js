import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/store/auth';
import router from '@/router';

// Configuration de base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête - Ajouter le token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gérer les erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Extraire les données de la réponse
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si le token est expiré (401) et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore();
        await authStore.refreshAccessToken();

        // Retry la requête originale avec le nouveau token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        const authStore = useAuthStore();
        await authStore.logout();
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }

    // Gérer les autres erreurs
    const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';

    message.error(errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;
