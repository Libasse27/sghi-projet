import { DataSource } from 'typeorm';
import { UsersSeed } from './users.seed';
import { PatientsSeed } from './patients.seed';

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('\n🌱 Starting database seeding...\n');

  try {
    // Run seeds in order
    await new UsersSeed().run(dataSource);
    await new PatientsSeed().run(dataSource);

    console.log('\n✅ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}
