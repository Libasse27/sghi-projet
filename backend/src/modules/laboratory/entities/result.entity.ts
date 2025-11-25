import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Analysis } from './analysis.entity';
import { User } from '../../users/entities/user.entity';

export enum ResultStatus {
  PENDING = 'En attente',
  ABNORMAL = 'Anormal',
  NORMAL = 'Normal',
  CRITICAL = 'Critique',
}

@Entity('lab_results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  analysisId: string;

  @ManyToOne(() => Analysis, (analysis) => analysis.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisId' })
  analysis: Analysis;

  @Column({ length: 200 })
  testName: string;

  @Column({ length: 100, nullable: true })
  testCode: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  numericValue: number;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ length: 100, nullable: true })
  referenceRange: string;

  @Column({
    type: 'enum',
    enum: ResultStatus,
    default: ResultStatus.PENDING,
  })
  status: ResultStatus;

  @Column({ type: 'boolean', default: false })
  isAbnormal: boolean;

  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  @Column({ type: 'text', nullable: true })
  interpretation: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'uuid', nullable: true })
  performedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedBy' })
  technician: User;

  @Column({ length: 200, nullable: true })
  performedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  performedDate: Date;

  @Column({ type: 'uuid', nullable: true })
  validatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'validatedBy' })
  validator: User;

  @Column({ length: 200, nullable: true })
  validatedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  validationDate: Date;

  @Column({ length: 100, nullable: true })
  method: string;

  @Column({ length: 100, nullable: true })
  instrument: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
