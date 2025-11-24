import apiClient from './api.service';

export const authService = {
  /**
   * Connexion
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Inscription
   */
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Déconnexion
   */
  logout() {
    return apiClient.post('/auth/logout');
  },

  /**
   * Récupérer le profil utilisateur
   */
  getProfile() {
    return apiClient.get('/auth/profile');
  },

  /**
   * Rafraîchir le token
   */
  refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  /**
   * Changer le mot de passe
   */
  changePassword(passwords) {
    return apiClient.post('/auth/change-password', passwords);
  },

  /**
   * Mot de passe oublié
   */
  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword(data) {
    return apiClient.post('/auth/reset-password', data);
  },
};
