import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateConsultations1700000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Table consultations
    await queryRunner.createTable(
      new Table({
        name: 'consultations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numeroConsultation',
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
            name: 'doctorId',
            type: 'uuid',
          },
          {
            name: 'doctorName',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'dateConsultation',
            type: 'timestamp',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'Planifiée'",
          },
          {
            name: 'motif',
            type: 'text',
          },
          {
            name: 'temperature',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'heartRate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'bloodPressureSystolic',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'bloodPressureDiastolic',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'respiratoryRate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'oxygenSaturation',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'weight',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'height',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'examenClinique',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'diagnostic',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'traitement',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'examensComplementaires',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'prochainRendezVous',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'montant',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'paye',
            type: 'boolean',
            default: false,
          },
          {
            name: 'salle',
            type: 'varchar',
            length: '50',
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

    // Indexes for consultations
    await queryRunner.createIndex(
      'consultations',
      new TableIndex({
        name: 'IDX_CONSULTATION_NUMERO',
        columnNames: ['numeroConsultation'],
      }),
    );

    await queryRunner.createIndex(
      'consultations',
      new TableIndex({
        name: 'IDX_CONSULTATION_PATIENT',
        columnNames: ['patientId'],
      }),
    );

    await queryRunner.createIndex(
      'consultations',
      new TableIndex({
        name: 'IDX_CONSULTATION_DOCTOR',
        columnNames: ['doctorId'],
      }),
    );

    await queryRunner.createIndex(
      'consultations',
      new TableIndex({
        name: 'IDX_CONSULTATION_DATE',
        columnNames: ['dateConsultation'],
      }),
    );

    await queryRunner.createIndex(
      'consultations',
      new TableIndex({
        name: 'IDX_CONSULTATION_STATUS',
        columnNames: ['status'],
      }),
    );

    // Foreign keys for consultations
    await queryRunner.createForeignKey(
      'consultations',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'consultations',
      new TableForeignKey({
        columnNames: ['doctorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('consultations');
  }
}
