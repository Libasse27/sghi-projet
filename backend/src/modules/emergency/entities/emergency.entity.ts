import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum EmergencyPriority {
  P1 = 'P1', // Urgence Absolue - Immédiat
  P2 = 'P2', // Urgence Relative - 20 min
  P3 = 'P3', // Urgence Non Vitale - 60 min
  P4 = 'P4', // Soins Rapides - 120 min
  P5 = 'P5', // Consultation - 240 min
}

export enum EmergencyStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  TRANSFERRED = 'transferred',
}

export enum ConsciousnessState {
  ALERT = 'alert',
  CONFUSED = 'confused',
  DROWSY = 'drowsy',
  UNCONSCIOUS = 'unconscious',
}

@Entity('emergencies')
export class Emergency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EmergencyPriority })
  priority: EmergencyPriority;

  @Column({ type: 'enum', enum: EmergencyStatus, default: EmergencyStatus.WAITING })
  status: EmergencyStatus;

  // Patient Information
  @Column()
  patientId: string;

  @Column()
  patientNom: string;

  @Column()
  patientPrenom: string;

  @Column({ type: 'int' })
  patientAge: number;

  @Column({ length: 1 })
  patientSexe: string;

  // Triage Information
  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  // Vital Signs
  @Column()
  bloodPressure: string; // Format: "120/80"

  @Column({ type: 'int' })
  heartRate: number; // bpm

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  temperature: number; // °C

  @Column({ type: 'int', nullable: true })
  respiratoryRate: number; // /min

  @Column({ type: 'int', nullable: true })
  oxygenSaturation: number; // %

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  bloodSugar: number; // g/L

  @Column({ type: 'int', default: 0 })
  painScale: number; // 0-10

  @Column({ type: 'enum', enum: ConsciousnessState, default: ConsciousnessState.ALERT })
  consciousness: ConsciousnessState;

  // Timing
  @CreateDateColumn()
  arrivalTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  takenCareAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'int', default: 0 })
  waitTime: number; // en minutes, calculé automatiquement

  // Staff Information
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'triaged_by' })
  triagedBy: User;

  @Column({ nullable: true })
  triagedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  // Transfer Information
  @Column({ nullable: true })
  transferredTo: string; // Service de destination

  @Column({ type: 'text', nullable: true })
  transferReason: string;

  // Cancellation
  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
