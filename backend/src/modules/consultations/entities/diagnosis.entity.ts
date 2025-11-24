import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';

export enum DiagnosisType {
  PRINCIPAL = 'Principal',
  SECONDARY = 'Secondaire',
  DIFFERENTIAL = 'Différentiel',
}

export enum DiagnosisSeverity {
  MILD = 'Léger',
  MODERATE = 'Modéré',
  SEVERE = 'Sévère',
  CRITICAL = 'Critique',
}

@Entity('diagnoses')
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Consultation associée
  @Column()
  consultationId: string;

  @ManyToOne(() => Consultation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consultationId' })
  consultation: Consultation;

  // Patient
  @Column()
  patientId: string;

  // Médecin
  @Column()
  doctorId: string;

  @Column({ length: 200 })
  doctorName: string;

  // Type de diagnostic
  @Column({
    type: 'enum',
    enum: DiagnosisType,
  })
  type: DiagnosisType;

  // Code CIM-10 (Classification Internationale des Maladies)
  @Column({ length: 10, nullable: true })
  codeCIM10: string;

  // Nom de la maladie/condition
  @Column({ length: 200 })
  condition: string;

  // Description détaillée
  @Column({ type: 'text' })
  description: string;

  // Sévérité
  @Column({
    type: 'enum',
    enum: DiagnosisSeverity,
  })
  severity: DiagnosisSeverity;

  // Date du diagnostic
  @Column({ type: 'date' })
  dateDiagnostic: Date;

  // Notes
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Statut (actif/résolu)
  @Column({ default: true })
  isActive: boolean;

  // Date de résolution (si résolu)
  @Column({ type: 'date', nullable: true })
  dateResolution: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
