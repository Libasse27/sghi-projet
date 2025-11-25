import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EmergencyCase } from './emergency-case.entity';
import { User } from '../../users/entities/user.entity';
import { EmergencyPriority } from './emergency-case.entity';

@Entity('triages')
export class Triage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  emergencyId: string;

  @ManyToOne(() => EmergencyCase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'emergencyId' })
  emergency: EmergencyCase;

  @Column({ type: 'uuid' })
  triageBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'triageBy' })
  triageUser: User;

  @Column({ length: 200 })
  triageByName: string;

  @Column({
    type: 'enum',
    enum: EmergencyPriority,
  })
  priorityAssigned: EmergencyPriority;

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string;

  @Column({ type: 'text', nullable: true })
  briefHistory: string;

  // Signes vitaux au triage
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
  allergies: string;

  @Column({ type: 'text', nullable: true })
  currentMedications: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp' })
  triageTime: Date;

  @CreateDateColumn()
  dateCreation: Date;
}
