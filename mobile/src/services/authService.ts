import apiClient from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
}

export interface AuthResponse {
  user: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    telephone?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
