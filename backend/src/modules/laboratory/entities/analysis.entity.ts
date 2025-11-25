import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
import { Sample } from './sample.entity';
import { Result } from './result.entity';

export enum AnalysisType {
  HEMATOLOGY = 'Hématologie',
  BIOCHEMISTRY = 'Biochimie',
  BACTERIOLOGY = 'Bactériologie',
  SEROLOGY = 'Sérologie',
  HORMONES = 'Hormones',
  BIOPSY = 'Biopsie',
  URINE = 'Analyse d\'urine',
  STOOL = 'Coproculture',
}

export enum AnalysisStatus {
  REQUESTED = 'Demandée',
  SAMPLE_COLLECTED = 'Échantillon collecté',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée',
  VALIDATED = 'Validée',
  CANCELLED = 'Annulée',
}

export enum AnalysisPriority {
  ROUTINE = 'Routine',
  URGENT = 'Urgent',
  EMERGENCY = 'Urgence',
}

@Entity('analyses')
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroAnalyse: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ type: 'uuid' })
  requestedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requestedBy' })
  requestingDoctor: User;

  @Column({ length: 200 })
  requestedByName: string;

  @Column({
    type: 'enum',
    enum: AnalysisType,
  })
  type: AnalysisType;

  @Column({
    type: 'enum',
    enum: AnalysisStatus,
    default: AnalysisStatus.REQUESTED,
  })
  status: AnalysisStatus;

  @Column({
    type: 'enum',
    enum: AnalysisPriority,
    default: AnalysisPriority.ROUTINE,
  })
  priority: AnalysisPriority;

  @Column({ type: 'json' })
  testsRequested: string[];

  @Column({ type: 'text', nullable: true })
  clinicalInfo: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Sample, (sample) => sample.analysis)
  samples: Sample[];

  @OneToMany(() => Result, (result) => result.analysis)
  results: Result[];

  @Column({ type: 'uuid', nullable: true })
  performedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedBy' })
  technician: User;

  @Column({ length: 200, nullable: true })
  performedByName: string;

  @Column({ type: 'uuid', nullable: true })
  validatedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'validatedBy' })
  validator: User;

  @Column({ length: 200, nullable: true })
  validatedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  requestDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  sampleCollectionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  analysisStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  validationDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant: number;

  @Column({ type: 'boolean', default: false })
  paye: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
