import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { runSeeds } from './index';

// Load environment variables
config({ path: resolve(__dirname, '../../../.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'sghi_user',
  password: process.env.DB_PASSWORD || 'sghi_password',
  database: process.env.DB_DATABASE || 'sghi_db',
  entities: [resolve(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: false,
});

async function bootstrap() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✓ Database connection established');

    await runSeeds(AppDataSource);

    await AppDataSource.destroy();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

bootstrap();
