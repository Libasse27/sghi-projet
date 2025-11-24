import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role,
    userFullName: (state) =>
      state.user ? `${state.user.prenom} ${state.user.nom}` : '',
  },

  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        const { user, accessToken, refreshToken } = response.data;

        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.isAuthenticated = true;

        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.isAuthenticated = false;
      }
    },

    async fetchProfile() {
      try {
        const response = await authService.getProfile();
        this.user = response.data;
        return response;
      } catch (error) {
        console.error('Fetch profile error:', error);
        throw error;
      }
    },

    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await authService.refreshToken(this.refreshToken);
        const { accessToken, refreshToken } = response.data;

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        return response;
      } catch (error) {
        console.error('Refresh token error:', error);
        await this.logout();
        throw error;
      }
    },

    setTokens({ accessToken, refreshToken }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    },
  },

  persist: {
    key: 'sghi-auth',
    storage: localStorage,
    paths: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
  },
});
