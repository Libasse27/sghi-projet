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
import { User } from '../../users/entities/user.entity';
import { Schedule } from './schedule.entity';
import { Attendance } from './attendance.entity';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum ContractType {
  PERMANENT = 'PERMANENT',
  TEMPORARY = 'TEMPORARY',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  CONSULTANT = 'CONSULTANT',
}

export enum Department {
  ADMINISTRATION = 'ADMINISTRATION',
  MEDICAL = 'MEDICAL',
  NURSING = 'NURSING',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  RADIOLOGY = 'RADIOLOGY',
  EMERGENCY = 'EMERGENCY',
  SURGERY = 'SURGERY',
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
  HR = 'HR',
  IT = 'IT',
  MAINTENANCE = 'MAINTENANCE',
  SECURITY = 'SECURITY',
  CLEANING = 'CLEANING',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  employeeNumber: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ unique: true })
  nationalId: string;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Column()
  position: string;

  @Column({ type: 'enum', enum: ContractType })
  contractType: ContractType;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'simple-array', nullable: true })
  qualifications: string[];

  @Column({ type: 'simple-array', nullable: true })
  certifications: string[];

  @Column({ type: 'int', default: 30 })
  annualLeaveDays: number;

  @Column({ type: 'int', default: 0 })
  usedLeaveDays: number;

  @Column({ type: 'int', default: 12 })
  sickLeaveDays: number;

  @Column({ type: 'int', default: 0 })
  usedSickLeaveDays: number;

  @Column({ nullable: true })
  supervisorId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'supervisorId' })
  supervisor: Employee;

  @OneToMany(() => Schedule, (schedule) => schedule.employee)
  schedules: Schedule[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
