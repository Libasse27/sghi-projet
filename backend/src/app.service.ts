import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): object {
    return {
      name: 'SGHI API',
      version: '1.0.0',
      description: 'Système de Gestion Hospitalière Intégré - Integrated Hospital Management System',
      documentation: '/api-docs',
      endpoints: {
        health: '/health',
        api: '/api',
      },
    };
  }

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        unit: 'MB',
      },
    };
  }
}
