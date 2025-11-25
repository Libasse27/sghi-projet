import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

export enum MedicineCategory {
  ANALGESIC = 'Analgésique',
  ANTIBIOTIC = 'Antibiotique',
  ANTIVIRAL = 'Antiviral',
  ANTIFUNGAL = 'Antifongique',
  ANTIINFLAMMATORY = 'Anti-inflammatoire',
  CARDIOVASCULAR = 'Cardiovasculaire',
  DIABETES = 'Diabète',
  RESPIRATORY = 'Respiratoire',
  GASTROINTESTINAL = 'Gastro-intestinal',
  HORMONAL = 'Hormonal',
  VITAMIN = 'Vitamine',
  OTHER = 'Autre',
}

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200, nullable: true })
  genericName: string;

  @Column({
    type: 'enum',
    enum: MedicineCategory,
  })
  category: MedicineCategory;

  @Column({ length: 100, nullable: true })
  manufacturer: string;

  @Column({ length: 50 })
  form: string;

  @Column({ length: 50 })
  dosage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  indications: string;

  @Column({ type: 'text', nullable: true })
  contraindications: string;

  @Column({ type: 'text', nullable: true })
  sideEffects: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'boolean', default: false })
  requiresPrescription: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Stock, (stock) => stock.medicine)
  stocks: Stock[];

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
