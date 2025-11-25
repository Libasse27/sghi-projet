import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
import { Medicine } from './medicine.entity';

@Entity('dispensings')
export class Dispensing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroDispensation: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ length: 200 })
  patientNom: string;

  @Column({ type: 'uuid', nullable: true })
  prescriptionId: string;

  @Column({ type: 'uuid' })
  medicineId: string;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column({ length: 200 })
  medicineName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  dosageInstructions: string;

  @Column({ type: 'uuid' })
  dispensedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'dispensedBy' })
  pharmacist: User;

  @Column({ length: 200 })
  pharmacistName: string;

  @Column({ type: 'timestamp' })
  dispensingDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @CreateDateColumn()
  dateCreation: Date;
}
