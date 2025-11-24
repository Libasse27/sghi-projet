import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

// Configurations
import appConfig from './config/app.config';
import { postgresConfig, mongoConfig } from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig, { jwtRefreshConfig } from './config/jwt.config';

// Modules métier
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';

// TODO: Importer les modules au fur et à mesure de leur création
// import { LaboratoryModule } from './modules/laboratory/laboratory.module';
// etc...

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, postgresConfig, mongoConfig, redisConfig, jwtConfig, jwtRefreshConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // PostgreSQL avec TypeORM (optionnel en développement)
    ...(process.env.DISABLE_DB !== 'true' ? [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          ...configService.get('postgres'),
          autoLoadEntities: true,
          retryAttempts: 3,
          retryDelay: 3000,
        }),
        inject: [ConfigService],
      }),
    ] : []),

    // MongoDB avec Mongoose (optionnel en développement)
    ...(process.env.DISABLE_MONGO !== 'true' ? [
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => configService.get('mongo'),
        inject: [ConfigService],
      }),
    ] : []),

    // Redis Cache (optionnel en développement)
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([{
        ttl: configService.get('app.throttle.ttl'),
        limit: configService.get('app.throttle.limit'),
      }]),
      inject: [ConfigService],
    }),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Modules métier (conditionnels si DB désactivée)
    ...(process.env.DISABLE_DB !== 'true' ? [
      AuthModule,
      EmergencyModule,
      PatientsModule,
      ConsultationsModule,
    ] : []),
    // LaboratoryModule,
    // ImagingModule,
    // HospitalizationModule,
    // PhysiotherapyModule,
    // PharmacyModule,
    // SurgeryModule,
    // BillingModule,
    // HrModule,
    // StatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guard pour rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // TODO: Ajouter JwtAuthGuard et RolesGuard quand Auth est activé
  ],
})
export class AppModule {}
