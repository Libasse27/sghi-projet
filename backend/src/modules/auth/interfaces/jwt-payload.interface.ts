import { UserRole } from '@shared/constants/roles.constants';

/**
 * Interface pour le payload JWT
 */
export interface JwtPayload {
  /**
   * User ID
   */
  sub: string;

  /**
   * Email de l'utilisateur
   */
  email: string;

  /**
   * Rôle de l'utilisateur
   */
  role: UserRole;

  /**
   * Type de token (access ou refresh)
   */
  type?: 'access' | 'refresh';

  /**
   * Date d'émission (timestamp)
   */
  iat?: number;

  /**
   * Date d'expiration (timestamp)
   */
  exp?: number;
}
