import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export default registerAs(
  'redis',
  (): CacheModuleOptions => ({
    store: redisStore as any,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600,
    max: 100,
  }),
);
