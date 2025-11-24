import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SGHI API')
    .setDescription(
      'API du Système de Gestion Hospitalière Intégré (SGHI) - Integrated Hospital Management System',
    )
    .setVersion('1.0')
    .setContact(
      'SGHI Team',
      'https://sghi.com',
      'support@sghi.com',
    )
    .addTag('auth', 'Authentification et autorisation')
    .addTag('patients', 'Gestion des patients')
    .addTag('consultations', 'Consultations médicales')
    .addTag('emergency', 'Urgences et triage')
    .addTag('laboratory', 'Laboratoire d\'analyses')
    .addTag('imaging', 'Imagerie médicale')
    .addTag('hospitalization', 'Hospitalisation et lits')
    .addTag('physiotherapy', 'Kinésithérapie et rééducation')
    .addTag('pharmacy', 'Pharmacie et dispensation')
    .addTag('surgery', 'Bloc opératoire')
    .addTag('billing', 'Facturation et paiements')
    .addTag('hr', 'Ressources humaines')
    .addTag('statistics', 'Statistiques et reporting')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Local development')
    .addServer('https://api.sghi.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'SGHI API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2C7A7B }
    `,
  });
}
