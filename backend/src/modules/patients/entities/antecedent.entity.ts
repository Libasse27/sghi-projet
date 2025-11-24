import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

export enum AntecedentType {
  MEDICAL = 'Médical',
  SURGICAL = 'Chirurgical',
  FAMILY = 'Familial',
  OBSTETRIC = 'Obstétrique',
}

@Entity('antecedents')
export class Antecedent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  // Type d'antécédent
  @Column({
    type: 'enum',
    enum: AntecedentType,
  })
  type: AntecedentType;

  // Description
  @Column({ type: 'text' })
  description: string;

  // Date de diagnostic/intervention
  @Column({ type: 'date', nullable: true })
  diagnosisDate: Date;

  // Statut (actif/résolu)
  @Column({ default: true })
  isActive: boolean;

  // Traitement en cours
  @Column({ type: 'text', nullable: true })
  currentTreatment: string;

  // Notes
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Pour les antécédents familiaux
  @Column({ length: 100, nullable: true })
  familyRelation: string; // Père, Mère, Frère, Soeur, etc.

  // Médecin qui a enregistré
  @Column({ nullable: true })
  recordedBy: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
