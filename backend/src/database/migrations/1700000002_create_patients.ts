import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePatients1700000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'patients',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numeroPatient',
            type: 'varchar',
            length: '50',
            isUnique: true,
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
            name: 'dateNaissance',
            type: 'date',
          },
          {
            name: 'sexe',
            type: 'varchar',
            length: '1',
          },
          {
            name: 'groupeSanguin',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'telephone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'adresse',
            type: 'text',
          },
          {
            name: 'profession',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'allergies',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'maladiesChroniques',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'antecedentsFamiliaux',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'antecedentsChirurgicaux',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'contactUrgenceNom',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'contactUrgenceTelephone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'contactUrgenceLien',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'assuranceNom',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'assuranceNumero',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'assuranceExpiration',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'actif',
            type: 'boolean',
            default: true,
          },
          {
            name: 'notes',
            type: 'text',
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
      'patients',
      new TableIndex({
        name: 'IDX_PATIENT_NUMERO',
        columnNames: ['numeroPatient'],
      }),
    );

    await queryRunner.createIndex(
      'patients',
      new TableIndex({
        name: 'IDX_PATIENT_NOM_PRENOM',
        columnNames: ['nom', 'prenom'],
      }),
    );

    await queryRunner.createIndex(
      'patients',
      new TableIndex({
        name: 'IDX_PATIENT_TELEPHONE',
        columnNames: ['telephone'],
      }),
    );

    await queryRunner.createIndex(
      'patients',
      new TableIndex({
        name: 'IDX_PATIENT_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'patients',
      new TableIndex({
        name: 'IDX_PATIENT_ACTIF',
        columnNames: ['actif'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('patients');
  }
}
