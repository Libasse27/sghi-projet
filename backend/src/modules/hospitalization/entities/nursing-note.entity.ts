import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Admission } from './admission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('nursing_notes')
export class NursingNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  admissionId: string;

  @ManyToOne(() => Admission, (admission) => admission.nursingNotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admissionId' })
  admission: Admission;

  @Column({ type: 'uuid' })
  nurseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'nurseId' })
  nurse: User;

  @Column({ length: 200 })
  nurseName: string;

  @Column({ type: 'timestamp' })
  noteDate: Date;

  @Column({ type: 'text' })
  observations: string;

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

  @Column({ type: 'text', nullable: true })
  medicationsAdministered: string;

  @Column({ type: 'text', nullable: true })
  proceduresPerformed: string;

  @CreateDateColumn()
  dateCreation: Date;
}
