import { SetMetadata } from '@nestjs/common';

/**
 * Décorateur pour marquer une route comme publique (pas d'authentification requise)
 * @example
 * @Public()
 * @Get('public-endpoint')
 * publicMethod() {}
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
