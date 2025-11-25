import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImagingExam } from './imaging-exam.entity';
import { User } from '../../users/entities/user.entity';

@Entity('imaging_reports')
export class ImagingReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  examId: string;

  @ManyToOne(() => ImagingExam, (exam) => exam.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: ImagingExam;

  @Column({ type: 'uuid' })
  radiologistId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'radiologistId' })
  radiologist: User;

  @Column({ length: 200 })
  radiologistName: string;

  @Column({ type: 'text' })
  findings: string;

  @Column({ type: 'text' })
  impression: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({ type: 'json', nullable: true })
  measurements: any;

  @Column({ type: 'boolean', default: false })
  isAbnormal: boolean;

  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  @Column({ type: 'timestamp' })
  reportDate: Date;

  @Column({ type: 'uuid', nullable: true })
  validatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'validatedBy' })
  validator: User;

  @Column({ length: 200, nullable: true })
  validatedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  validationDate: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
