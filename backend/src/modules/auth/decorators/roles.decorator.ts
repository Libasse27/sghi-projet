import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@shared/constants/roles.constants';

/**
 * Décorateur pour spécifier les rôles autorisés à accéder à une route
 * @param roles - Liste des rôles autorisés
 * @example
 * @Roles(UserRole.ADMIN, UserRole.DOCTOR)
 * @Get('protected-endpoint')
 * protectedMethod() {}
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
