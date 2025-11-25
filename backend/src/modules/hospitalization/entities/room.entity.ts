import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bed } from './bed.entity';

export enum RoomType {
  STANDARD = 'Standard',
  VIP = 'VIP',
  ICU = 'Réanimation',
  ISOLATION = 'Isolement',
  MATERNITY = 'Maternité',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroSalle: string;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @Column({ length: 100 })
  department: string;

  @Column({ type: 'int' })
  floor: number;

  @Column({ type: 'int' })
  capacity: number;

  @OneToMany(() => Bed, (bed) => bed.room)
  beds: Bed[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
