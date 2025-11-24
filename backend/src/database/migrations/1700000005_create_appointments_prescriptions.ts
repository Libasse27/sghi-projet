import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAppointmentsPrescriptions1700000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Table appointments
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numeroRendezVous',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'patientId',
            type: 'uuid',
          },
          {
            name: 'patientNom',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'patientTelephone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'doctorId',
            type: 'uuid',
          },
          {
            name: 'doctorName',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'specialite',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'dateRendezVous',
            type: 'timestamp',
          },
          {
            name: 'dureeEstimee',
            type: 'int',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'Planifié'",
          },
          {
            name: 'motif',
            type: 'text',
          },
          {
            name: 'salle',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'rappelEnvoye',
            type: 'boolean',
            default: false,
          },
          {
            name: 'dateRappel',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'consultationId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'dateCreation',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dateModification',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Table prescriptions
    await queryRunner.createTable(
      new Table({
        name: 'prescriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numeroPrescription',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'consultationId',
            type: 'uuid',
          },
          {
            name: 'patientId',
            type: 'uuid',
          },
          {
            name: 'patientNom',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'doctorId',
            type: 'uuid',
          },
          {
            name: 'doctorName',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'datePrescription',
            type: 'date',
          },
          {
            name: 'medicaments',
            type: 'json',
          },
          {
            name: 'instructions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dureeTotale',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'renouvelable',
            type: 'boolean',
            default: false,
          },
          {
            name: 'nombreRenouvellements',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'Active'",
          },
          {
            name: 'dateExpiration',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'dateCreation',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dateModification',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Indexes for appointments
    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_APPOINTMENT_NUMERO',
        columnNames: ['numeroRendezVous'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_APPOINTMENT_PATIENT',
        columnNames: ['patientId'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_APPOINTMENT_DOCTOR',
        columnNames: ['doctorId'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_APPOINTMENT_DATE',
        columnNames: ['dateRendezVous'],
      }),
    );

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'IDX_APPOINTMENT_STATUS',
        columnNames: ['status'],
      }),
    );

    // Indexes for prescriptions
    await queryRunner.createIndex(
      'prescriptions',
      new TableIndex({
        name: 'IDX_PRESCRIPTION_NUMERO',
        columnNames: ['numeroPrescription'],
      }),
    );

    await queryRunner.createIndex(
      'prescriptions',
      new TableIndex({
        name: 'IDX_PRESCRIPTION_PATIENT',
        columnNames: ['patientId'],
      }),
    );

    await queryRunner.createIndex(
      'prescriptions',
      new TableIndex({
        name: 'IDX_PRESCRIPTION_CONSULTATION',
        columnNames: ['consultationId'],
      }),
    );

    await queryRunner.createIndex(
      'prescriptions',
      new TableIndex({
        name: 'IDX_PRESCRIPTION_STATUS',
        columnNames: ['status'],
      }),
    );

    // Foreign keys for appointments
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['doctorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['consultationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consultations',
        onDelete: 'SET NULL',
      }),
    );

    // Foreign keys for prescriptions
    await queryRunner.createForeignKey(
      'prescriptions',
      new TableForeignKey({
        columnNames: ['consultationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'consultations',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'prescriptions',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'prescriptions',
      new TableForeignKey({
        columnNames: ['doctorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prescriptions');
    await queryRunner.dropTable('appointments');
  }
}
