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

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  // Type de dossier
  @Column({ length: 50 })
  type: string; // Consultation, Hospitalisation, Urgence, etc.

  // Date du dossier
  @Column({ type: 'timestamp' })
  recordDate: Date;

  // Médecin responsable
  @Column({ nullable: true })
  doctorId: string;

  @Column({ length: 100, nullable: true })
  doctorName: string;

  // Motif de consultation/hospitalisation
  @Column({ type: 'text' })
  reason: string;

  // Diagnostic
  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  // Traitement prescrit
  @Column({ type: 'text', nullable: true })
  treatment: string;

  // Examens réalisés
  @Column({ type: 'text', nullable: true })
  examinations: string;

  // Résultats d'examens
  @Column({ type: 'text', nullable: true })
  results: string;

  // Notes du médecin
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Constantes vitales
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heartRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodPressureSystolic: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bloodPressureDiastolic: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  respiratoryRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  oxygenSaturation: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  // Statut du dossier
  @Column({ default: 'En cours' })
  status: string; // En cours, Terminé, Archivé

  // Fichiers attachés
  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
