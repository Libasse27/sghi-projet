import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

export enum EmergencyPriority {
  P1 = 'P1', // Critique - immédiat
  P2 = 'P2', // Très urgent - 15 min
  P3 = 'P3', // Urgent - 30 min
  P4 = 'P4', // Standard - 1 heure
  P5 = 'P5', // Non urgent - 2 heures
}

export enum EmergencyStatus {
  EN_ATTENTE = 'En attente',
  TRIAGE_EN_COURS = 'Triage en cours',
  EN_COURS = 'En cours',
  TERMINE = 'Terminé',
  TRANSFERE = 'Transféré',
  HOSPITALISE = 'Hospitalisé',
  SORTI = 'Sorti',
}

@Entity('emergencies')
export class EmergencyCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroUrgence: string;

  @Column({ type: 'uuid', nullable: true })
  patientId: string;

  @ManyToOne(() => Patient, { nullable: true })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ type: 'int', nullable: true })
  patientAge: number;

  @Column({ length: 1 })
  patientSexe: string;

  @Column({
    type: 'enum',
    enum: EmergencyPriority,
  })
  priority: EmergencyPriority;

  @Column({ type: 'text' })
  motif: string;

  @Column({
    type: 'enum',
    enum: EmergencyStatus,
    default: EmergencyStatus.EN_ATTENTE,
  })
  status: EmergencyStatus;

  // Signes vitaux
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

  @Column({ type: 'int', nullable: true })
  painScale: number;

  @Column({ length: 50, nullable: true })
  consciousness: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'uuid', nullable: true })
  triageBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'triageBy' })
  triageUser: User;

  @Column({ length: 200, nullable: true })
  triageByName: string;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedDoctor: User;

  @Column({ length: 200, nullable: true })
  assignedToName: string;

  @Column({ length: 50, nullable: true })
  salle: string;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  triageTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  careTakenTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  dischargeTime: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
