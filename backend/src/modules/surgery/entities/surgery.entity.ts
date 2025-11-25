import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { OperatingRoom } from './operating-room.entity';

export enum SurgeryType {
  GENERAL = 'GENERAL',
  ORTHOPEDIC = 'ORTHOPEDIC',
  CARDIOVASCULAR = 'CARDIOVASCULAR',
  NEUROSURGERY = 'NEUROSURGERY',
  GYNECOLOGY = 'GYNECOLOGY',
  UROLOGY = 'UROLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  ENT = 'ENT',
  PLASTIC = 'PLASTIC',
  PEDIATRIC = 'PEDIATRIC',
}

export enum SurgeryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export enum AnesthesiaType {
  GENERAL = 'GENERAL',
  SPINAL = 'SPINAL',
  EPIDURAL = 'EPIDURAL',
  LOCAL = 'LOCAL',
  SEDATION = 'SEDATION',
}

@Entity('surgeries')
export class Surgery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroChirurgie: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  surgeonId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'surgeonId' })
  surgeon: User;

  @Column({ nullable: true })
  anesthesiologistId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'anesthesiologistId' })
  anesthesiologist: User;

  @Column({ nullable: true })
  operatingRoomId: string;

  @ManyToOne(() => OperatingRoom)
  @JoinColumn({ name: 'operatingRoomId' })
  operatingRoom: OperatingRoom;

  @Column({ type: 'enum', enum: SurgeryType })
  type: SurgeryType;

  @Column()
  procedure: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'int' })
  estimatedDuration: number; // in minutes

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'enum', enum: AnesthesiaType })
  anesthesiaType: AnesthesiaType;

  @Column({ type: 'enum', enum: SurgeryStatus, default: SurgeryStatus.SCHEDULED })
  status: SurgeryStatus;

  @Column({ type: 'text', nullable: true })
  preOpNotes: string;

  @Column({ type: 'text', nullable: true })
  intraOpNotes: string;

  @Column({ type: 'text', nullable: true })
  postOpNotes: string;

  @Column({ type: 'simple-array', nullable: true })
  complications: string[];

  @Column({ type: 'simple-array', nullable: true })
  team: string[]; // Array of user IDs

  @Column({ type: 'text', nullable: true })
  equipmentUsed: string;

  @Column({ default: false })
  isEmergency: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
