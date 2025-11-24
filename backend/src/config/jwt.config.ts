import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    },
  }),
);

export const jwtRefreshConfig = registerAs('jwtRefresh', () => ({
  secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
