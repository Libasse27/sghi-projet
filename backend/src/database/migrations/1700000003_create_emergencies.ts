import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateEmergencies1700000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'emergencies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numeroUrgence',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'patientId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'patientNom',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'patientAge',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'patientSexe',
            type: 'varchar',
            length: '1',
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '10',
          },
          {
            name: 'motif',
            type: 'text',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'En attente'",
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
            name: 'painScale',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'consciousness',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'symptoms',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observations',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'triageBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'triageByName',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'assignedTo',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assignedToName',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'salle',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'arrivalTime',
            type: 'timestamp',
          },
          {
            name: 'triageTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'careTakenTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'dischargeTime',
            type: 'timestamp',
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

    // Create indexes
    await queryRunner.createIndex(
      'emergencies',
      new TableIndex({
        name: 'IDX_EMERGENCY_NUMERO',
        columnNames: ['numeroUrgence'],
      }),
    );

    await queryRunner.createIndex(
      'emergencies',
      new TableIndex({
        name: 'IDX_EMERGENCY_PRIORITY',
        columnNames: ['priority'],
      }),
    );

    await queryRunner.createIndex(
      'emergencies',
      new TableIndex({
        name: 'IDX_EMERGENCY_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'emergencies',
      new TableIndex({
        name: 'IDX_EMERGENCY_PATIENT',
        columnNames: ['patientId'],
      }),
    );

    await queryRunner.createIndex(
      'emergencies',
      new TableIndex({
        name: 'IDX_EMERGENCY_ARRIVAL_TIME',
        columnNames: ['arrivalTime'],
      }),
    );

    // Foreign keys
    await queryRunner.createForeignKey(
      'emergencies',
      new TableForeignKey({
        columnNames: ['patientId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('emergencies');
  }
}
