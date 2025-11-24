import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nom',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'prenom',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'telephone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            default: "'RECEPTIONIST'",
          },
          {
            name: 'photo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'specialite',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'numeroEmploye',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'service',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'isEmailVerified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'emailVerificationToken',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'emailVerifiedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'passwordResetToken',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'passwordResetExpires',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'refreshToken',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'lastLoginAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'lastLoginIp',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'createdBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updatedBy',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Index sur l'email pour des recherches rapides
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    // Index sur le role
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_ROLE',
        columnNames: ['role'],
      }),
    );

    // Index sur isActive
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_IS_ACTIVE',
        columnNames: ['isActive'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USERS_IS_ACTIVE');
    await queryRunner.dropIndex('users', 'IDX_USERS_ROLE');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
    await queryRunner.dropTable('users');
  }
}
