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
import { ImagingReport } from './imaging-report.entity';

export enum ImagingModality {
  XRAY = 'Radiographie',
  CT = 'Scanner',
  MRI = 'IRM',
  ULTRASOUND = 'Échographie',
  MAMMOGRAPHY = 'Mammographie',
  PET = 'PET Scan',
  FLUOROSCOPY = 'Fluoroscopie',
}

export enum ImagingStatus {
  REQUESTED = 'Demandé',
  SCHEDULED = 'Planifié',
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminé',
  REPORTED = 'Rapporté',
  VALIDATED = 'Validé',
  CANCELLED = 'Annulé',
}

export enum ImagingPriority {
  ROUTINE = 'Routine',
  URGENT = 'Urgent',
  EMERGENCY = 'Urgence',
  STAT = 'STAT',
}

@Entity('imaging_exams')
export class ImagingExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroExamen: string;

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
    enum: ImagingModality,
  })
  modality: ImagingModality;

  @Column({
    type: 'enum',
    enum: ImagingStatus,
    default: ImagingStatus.REQUESTED,
  })
  status: ImagingStatus;

  @Column({
    type: 'enum',
    enum: ImagingPriority,
    default: ImagingPriority.ROUTINE,
  })
  priority: ImagingPriority;

  @Column({ type: 'text' })
  studyDescription: string;

  @Column({ type: 'text', nullable: true })
  clinicalIndication: string;

  @Column({ length: 200, nullable: true })
  bodyPart: string;

  @Column({ type: 'boolean', default: false })
  withContrast: boolean;

  @Column({ type: 'text', nullable: true })
  contrastAgent: string;

  @Column({ type: 'timestamp', nullable: true })
  requestDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  performedDate: Date;

  @Column({ type: 'uuid', nullable: true })
  performedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedBy' })
  technician: User;

  @Column({ length: 200, nullable: true })
  performedByName: string;

  @Column({ type: 'uuid', nullable: true })
  reportedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reportedBy' })
  radiologist: User;

  @Column({ length: 200, nullable: true })
  reportedByName: string;

  @Column({ type: 'int', nullable: true })
  numberOfImages: number;

  @Column({ type: 'text', nullable: true })
  dicomStudyInstanceUID: string;

  @Column({ type: 'text', nullable: true })
  pacsUrl: string;

  @OneToMany(() => ImagingReport, (report) => report.exam)
  reports: ImagingReport[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant: number;

  @Column({ type: 'boolean', default: false })
  paye: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
