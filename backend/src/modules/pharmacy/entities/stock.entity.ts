import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medicine } from './medicine.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  medicineId: string;

  @ManyToOne(() => Medicine, (medicine) => medicine.stocks)
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column({ unique: true, length: 50 })
  batchNumber: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  minimumStock: number;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({ length: 100, nullable: true })
  supplier: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchasePrice: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
