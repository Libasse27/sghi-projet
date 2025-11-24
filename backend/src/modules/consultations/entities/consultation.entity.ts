import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum ConsultationStatus {
  SCHEDULED = 'Planifiée',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée',
  CANCELLED = 'Annulée',
}

export enum ConsultationType {
  INITIAL = 'Première consultation',
  FOLLOW_UP = 'Suivi',
  EMERGENCY = 'Urgence',
  CONTROL = 'Contrôle',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Numéro de consultation
  @Column({ unique: true })
  numeroConsultation: string; // C-2024-0001

  // Patient
  @Column()
  patientId: string;

  @Column({ length: 200 })
  patientNom: string;

  // Médecin
  @Column()
  doctorId: string;

  @Column({ length: 200 })
  doctorName: string;

  // Type de consultation
  @Column({
    type: 'enum',
    enum: ConsultationType,
  })
  type: ConsultationType;

  // Date et heure
  @Column({ type: 'timestamp' })
  dateConsultation: Date;

  // Statut
  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.SCHEDULED,
  })
  status: ConsultationStatus;

  // Motif de consultation
  @Column({ type: 'text' })
  motif: string;

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

  // Examen clinique
  @Column({ type: 'text', nullable: true })
  examenClinique: string;

  // Diagnostic
  @Column({ type: 'text', nullable: true })
  diagnostic: string;

  // Traitement prescrit
  @Column({ type: 'text', nullable: true })
  traitement: string;

  // Examens complémentaires demandés
  @Column({ type: 'text', nullable: true })
  examensComplementaires: string;

  // Notes du médecin
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Prochain rendez-vous
  @Column({ type: 'timestamp', nullable: true })
  prochainRendezVous: Date;

  // Montant
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant: number;

  // Payé
  @Column({ default: false })
  paye: boolean;

  // Salle de consultation
  @Column({ length: 50, nullable: true })
  salle: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
