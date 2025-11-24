import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UsersSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository('User');

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@sghi.sn',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        phone: '+221771234567',
        role: 'SUPER_ADMIN',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'dr.fall@sghi.sn',
        password: hashedPassword,
        firstName: 'Ousmane',
        lastName: 'Fall',
        phone: '+221771234568',
        role: 'DOCTOR',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'dr.diop@sghi.sn',
        password: hashedPassword,
        firstName: 'Awa',
        lastName: 'Diop',
        phone: '+221771234569',
        role: 'DOCTOR',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'infirmier.sow@sghi.sn',
        password: hashedPassword,
        firstName: 'Mamadou',
        lastName: 'Sow',
        phone: '+221771234570',
        role: 'NURSE_CHIEF',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'receptionist@sghi.sn',
        password: hashedPassword,
        firstName: 'Fatou',
        lastName: 'Ndiaye',
        phone: '+221771234571',
        role: 'RECEPTIONIST',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'pharmacist@sghi.sn',
        password: hashedPassword,
        firstName: 'Cheikh',
        lastName: 'Sy',
        phone: '+221771234572',
        role: 'PHARMACIST',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'lab.tech@sghi.sn',
        password: hashedPassword,
        firstName: 'Aminata',
        lastName: 'Ba',
        phone: '+221771234573',
        role: 'LAB_TECHNICIAN',
        isActive: true,
        isEmailVerified: true,
      },
    ];

    await userRepository.save(users);
    console.log(`✓ ${users.length} users seeded successfully`);
  }
}
