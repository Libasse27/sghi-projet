import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PhysioSession } from './physio-session.entity';

@Entity('physio_billing')
export class PhysioBilling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => PhysioSession)
  @JoinColumn({ name: 'sessionId' })
  session: PhysioSession;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidDate: Date;

  @Column({ length: 50, nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  dateCreation: Date;
}
