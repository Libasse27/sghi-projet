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
import { Bed } from './bed.entity';
import { NursingNote } from './nursing-note.entity';

export enum AdmissionStatus {
  ADMITTED = 'Admis',
  IN_TREATMENT = 'En traitement',
  DISCHARGED = 'Sorti',
  TRANSFERRED = 'Transféré',
  DECEASED = 'Décédé',
}

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroAdmission: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ type: 'uuid' })
  admittingDoctor: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admittingDoctor' })
  doctor: User;

  @Column({ length: 200 })
  doctorName: string;

  @Column({ type: 'uuid' })
  bedId: string;

  @ManyToOne(() => Bed, (bed) => bed.admissions)
  @JoinColumn({ name: 'bedId' })
  bed: Bed;

  @Column({
    type: 'enum',
    enum: AdmissionStatus,
    default: AdmissionStatus.ADMITTED,
  })
  status: AdmissionStatus;

  @Column({ type: 'timestamp' })
  admissionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dischargeDate: Date;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment: string;

  @Column({ type: 'text', nullable: true })
  dischargeSummary: string;

  @OneToMany(() => NursingNote, (note) => note.admission)
  nursingNotes: NursingNote[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost: number;

  @Column({ type: 'boolean', default: false })
  paye: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
