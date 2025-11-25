import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OperatingRoomType {
  GENERAL = 'GENERAL',
  SPECIALIZED = 'SPECIALIZED',
  HYBRID = 'HYBRID',
  AMBULATORY = 'AMBULATORY',
}

export enum OperatingRoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
}

@Entity('operating_rooms')
export class OperatingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroSalle: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: OperatingRoomType })
  type: OperatingRoomType;

  @Column({ type: 'enum', enum: OperatingRoomStatus, default: OperatingRoomStatus.AVAILABLE })
  status: OperatingRoomStatus;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'simple-array', nullable: true })
  equipment: string[];

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  maintenanceNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextMaintenanceDate: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
