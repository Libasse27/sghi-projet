import { User } from '../entities/user.entity';

/**
 * Interface pour la réponse d'authentification
 */
export interface AuthResponse {
  /**
   * Utilisateur authentifié
   */
  user: Partial<User>;

  /**
   * Access token JWT
   */
  accessToken: string;

  /**
   * Refresh token JWT
   */
  refreshToken: string;
}

/**
 * Interface pour la réponse de refresh token
 */
export interface TokenRefreshResponse {
  /**
   * Nouveau access token
   */
  accessToken: string;

  /**
   * Nouveau refresh token
   */
  refreshToken: string;
}
