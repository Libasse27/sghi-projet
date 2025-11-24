import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Configuration service
  const configService = app.get(ConfigService);
  let port = configService.get<number>('app.port');
  const apiPrefix = configService.get<string>('app.apiPrefix');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  const corsOrigin = configService.get<string[]>('app.cors.origin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Security middleware
  app.use(helmet());

  // Compression
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger documentation
  try {
    if (process.env.NODE_ENV !== 'production') {
      setupSwagger(app);
    }
  } catch (error) {
    console.warn('⚠️  Swagger setup failed:', error.message);
  }

  // Start server with fallback port if already in use
  try {
    await app.listen(port);
  } catch (err: any) {
    if (err?.code === 'EADDRINUSE') {
      const nextPort = (Number(port) || 3000) + 1;
      console.warn(`Port ${port} in use, trying ${nextPort}...`);
      port = nextPort;
      await app.listen(port);
    } else {
      throw err;
    }
  }

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   🏥  SGHI API - Système de Gestion Hospitalière       ║
  ║                                                          ║
  ║   🚀  Server running on: http://localhost:${port}        ║
  ║   📚  API Documentation: http://localhost:${port}/api-docs  ║
  ║   🌍  Environment: ${process.env.NODE_ENV || 'development'}                    ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
}

// Prevent double bootstrap in watch/bundled contexts
if (process.env.SGHI_BOOTSTRAPPED !== '1') {
  process.env.SGHI_BOOTSTRAPPED = '1';
  bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
  });
} else {
  // eslint-disable-next-line no-console
  console.log('SGHI bootstrap skipped (already bootstrapped).');
}

