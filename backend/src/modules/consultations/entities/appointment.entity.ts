import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AppointmentStatus {
  SCHEDULED = 'Planifié',
  CONFIRMED = 'Confirmé',
  CANCELLED = 'Annulé',
  COMPLETED = 'Terminé',
  NO_SHOW = 'Absent',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Numéro de rendez-vous
  @Column({ unique: true })
  numeroRendezVous: string; // RDV-2024-0001

  // Patient
  @Column()
  patientId: string;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ length: 20, nullable: true })
  patientTelephone: string;

  // Médecin
  @Column()
  doctorId: string;

  @Column({ length: 200 })
  doctorName: string;

  @Column({ length: 100, nullable: true })
  specialite: string;

  // Date et heure
  @Column({ type: 'timestamp' })
  dateRendezVous: Date;

  @Column({ type: 'int' })
  dureeEstimee: number; // en minutes

  // Statut
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  // Motif
  @Column({ type: 'text' })
  motif: string;

  // Salle
  @Column({ length: 50, nullable: true })
  salle: string;

  // Notes
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Rappel envoyé
  @Column({ default: false })
  rappelEnvoye: boolean;

  // Date du rappel
  @Column({ type: 'timestamp', nullable: true })
  dateRappel: Date;

  // Consultation associée (une fois créée)
  @Column({ nullable: true })
  consultationId: string;

  // Créé par
  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
