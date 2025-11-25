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
import { RehabilitationPlan } from './rehabilitation-plan.entity';

export enum SessionStatus {
  SCHEDULED = 'Planifiée',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée',
  CANCELLED = 'Annulée',
  NO_SHOW = 'Absent',
}

@Entity('physio_sessions')
export class PhysioSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroSession: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ type: 'uuid' })
  therapistId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'therapistId' })
  therapist: User;

  @Column({ length: 200 })
  therapistName: string;

  @Column({ type: 'uuid', nullable: true })
  planId: string;

  @ManyToOne(() => RehabilitationPlan, { nullable: true })
  @JoinColumn({ name: 'planId' })
  plan: RehabilitationPlan;

  @Column({ type: 'timestamp' })
  sessionDate: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.SCHEDULED,
  })
  status: SessionStatus;

  @Column({ type: 'text' })
  treatmentType: string;

  @Column({ type: 'text', nullable: true })
  exercisesPerformed: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  progress: string;

  @Column({ type: 'int', nullable: true })
  painLevelBefore: number;

  @Column({ type: 'int', nullable: true })
  painLevelAfter: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant: number;

  @Column({ type: 'boolean', default: false })
  paye: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
