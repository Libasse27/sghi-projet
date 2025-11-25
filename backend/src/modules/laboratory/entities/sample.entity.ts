import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Analysis } from './analysis.entity';
import { User } from '../../users/entities/user.entity';

export enum SampleType {
  BLOOD = 'Sang',
  URINE = 'Urine',
  STOOL = 'Selles',
  SALIVA = 'Salive',
  SPUTUM = 'Crachat',
  CSF = 'LCR',
  TISSUE = 'Tissu',
  SWAB = 'Écouvillon',
  OTHER = 'Autre',
}

export enum SampleStatus {
  COLLECTED = 'Collecté',
  IN_TRANSIT = 'En transit',
  RECEIVED = 'Reçu',
  PROCESSING = 'En traitement',
  PROCESSED = 'Traité',
  REJECTED = 'Rejeté',
}

@Entity('samples')
export class Sample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroEchantillon: string;

  @Column({ type: 'uuid' })
  analysisId: string;

  @ManyToOne(() => Analysis, (analysis) => analysis.samples, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisId' })
  analysis: Analysis;

  @Column({
    type: 'enum',
    enum: SampleType,
  })
  type: SampleType;

  @Column({
    type: 'enum',
    enum: SampleStatus,
    default: SampleStatus.COLLECTED,
  })
  status: SampleStatus;

  @Column({ type: 'timestamp' })
  collectionDate: Date;

  @Column({ type: 'uuid' })
  collectedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'collectedBy' })
  collector: User;

  @Column({ length: 200 })
  collectedByName: string;

  @Column({ length: 100, nullable: true })
  container: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  volume: number;

  @Column({ length: 20, nullable: true })
  volumeUnit: string;

  @Column({ type: 'text', nullable: true })
  storageConditions: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  @Column({ type: 'text', nullable: true })
  qualityIssues: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  receivedDate: Date;

  @Column({ type: 'uuid', nullable: true })
  receivedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'receivedBy' })
  receiver: User;

  @Column({ length: 200, nullable: true })
  receivedByName: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  dateCreation: Date;
}
