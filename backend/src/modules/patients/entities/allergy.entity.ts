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

export enum AllergySeverity {
  MILD = 'Légère',
  MODERATE = 'Modérée',
  SEVERE = 'Sévère',
  LIFE_THREATENING = 'Potentiellement mortelle',
}

export enum AllergyType {
  MEDICATION = 'Médicament',
  FOOD = 'Alimentaire',
  ENVIRONMENTAL = 'Environnementale',
  OTHER = 'Autre',
}

@Entity('allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  // Type d'allergie
  @Column({
    type: 'enum',
    enum: AllergyType,
  })
  type: AllergyType;

  // Nom de l'allergène
  @Column({ length: 200 })
  allergen: string;

  // Réaction
  @Column({ type: 'text' })
  reaction: string;

  // Sévérité
  @Column({
    type: 'enum',
    enum: AllergySeverity,
  })
  severity: AllergySeverity;

  // Date de découverte
  @Column({ type: 'date', nullable: true })
  discoveryDate: Date;

  // Statut (active/résolue)
  @Column({ default: true })
  isActive: boolean;

  // Notes
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Médecin qui a enregistré
  @Column({ nullable: true })
  recordedBy: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
