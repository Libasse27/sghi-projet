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
import { Room } from './room.entity';
import { Admission } from './admission.entity';

export enum BedStatus {
  AVAILABLE = 'Disponible',
  OCCUPIED = 'Occupé',
  RESERVED = 'Réservé',
  MAINTENANCE = 'Maintenance',
  CLEANING = 'Nettoyage',
}

@Entity('beds')
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  numeroLit: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => Room, (room) => room.beds)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({
    type: 'enum',
    enum: BedStatus,
    default: BedStatus.AVAILABLE,
  })
  status: BedStatus;

  @OneToMany(() => Admission, (admission) => admission.bed)
  admissions: Admission[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
