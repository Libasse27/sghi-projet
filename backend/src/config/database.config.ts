import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const postgresConfig = registerAs(
  'postgres',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'sghi_user',
    password: process.env.POSTGRES_PASSWORD || 'sghi_password',
    database: process.env.POSTGRES_DB || 'sghi_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: false,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
    // Désactiver pg-native pour éviter les erreurs
    nativeDriver: false,
  }),
);

export const mongoConfig = registerAs(
  'mongo',
  (): MongooseModuleOptions => ({
    uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE || 'admin'}`,
    retryAttempts: 3,
    retryDelay: 1000,
  }),
);
