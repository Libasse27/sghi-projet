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
import { Payment } from './payment.entity';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceType {
  CONSULTATION = 'CONSULTATION',
  SURGERY = 'SURGERY',
  HOSPITALIZATION = 'HOSPITALIZATION',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroFacture: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'enum', enum: InvoiceType })
  type: InvoiceType;

  @Column({ type: 'timestamp' })
  invoiceDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'simple-json' })
  items: InvoiceItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceDue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  insuranceCompany: string;

  @Column({ nullable: true })
  insurancePolicyNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  insuranceCoverage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  patientResponsibility: number;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  serviceCode?: string;
  serviceDate?: Date;
}
