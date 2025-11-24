import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Numéro d'ordonnance
  @Column({ unique: true })
  numeroPrescription: string; // ORD-2024-0001

  // Consultation associée
  @Column()
  consultationId: string;

  @ManyToOne(() => Consultation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consultationId' })
  consultation: Consultation;

  // Patient
  @Column()
  patientId: string;

  @Column({ length: 200 })
  patientNom: string;

  // Médecin prescripteur
  @Column()
  doctorId: string;

  @Column({ length: 200 })
  doctorName: string;

  // Date de l'ordonnance
  @Column({ type: 'date' })
  datePrescription: Date;

  // Médicaments (JSON array)
  @Column({ type: 'json' })
  medicaments: Array<{
    nom: string;
    dosage: string;
    forme: string; // Comprimé, Sirop, Injection, etc.
    quantite: number;
    frequence: string; // 3 fois par jour, etc.
    duree: string; // 7 jours, 2 semaines, etc.
    instructions: string;
  }>;

  // Instructions générales
  @Column({ type: 'text', nullable: true })
  instructions: string;

  // Durée totale du traitement
  @Column({ length: 50, nullable: true })
  dureeTotale: string;

  // Renouvellement possible
  @Column({ default: false })
  renouvelable: boolean;

  // Nombre de renouvellements autorisés
  @Column({ type: 'int', default: 0 })
  nombreRenouvellements: number;

  // Statut
  @Column({ default: 'Active' })
  status: string; // Active, Expiré, Annulé

  // Date d'expiration
  @Column({ type: 'date', nullable: true })
  dateExpiration: Date;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
