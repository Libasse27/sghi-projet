import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceCategory {
  CONSULTATION = 'CONSULTATION',
  SURGERY = 'SURGERY',
  HOSPITALIZATION = 'HOSPITALIZATION',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
  EMERGENCY = 'EMERGENCY',
  DENTAL = 'DENTAL',
  OTHER = 'OTHER',
}

@Entity('price_list')
export class PriceList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serviceCode: string;

  @Column()
  serviceName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ServiceCategory })
  category: ServiceCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  insurancePrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
