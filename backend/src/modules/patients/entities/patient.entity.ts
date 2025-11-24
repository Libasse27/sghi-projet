import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations personnelles
  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100 })
  prenom: string;

  @Column({ type: 'date' })
  dateNaissance: Date;

  @Column({ length: 1 })
  sexe: string; // M ou F

  @Column({ type: 'enum', enum: BloodGroup, nullable: true })
  groupeSanguin: BloodGroup;

  // Contact
  @Column({ length: 20 })
  telephone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text' })
  adresse: string;

  @Column({ length: 100, nullable: true })
  profession: string;

  // Antécédents médicaux
  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  maladiesChroniques: string;

  @Column({ type: 'text', nullable: true })
  antecedentsFamiliaux: string;

  @Column({ type: 'text', nullable: true })
  antecedentsChirurgicaux: string;

  // Contact d'urgence
  @Column({ length: 100, nullable: true })
  contactUrgenceNom: string;

  @Column({ length: 20, nullable: true })
  contactUrgenceTelephone: string;

  @Column({ length: 50, nullable: true })
  contactUrgenceLien: string;

  // Informations administratives
  @Column({ unique: true })
  numeroPatient: string; // P-2024-001

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Assurance
  @Column({ length: 100, nullable: true })
  assuranceNom: string;

  @Column({ length: 100, nullable: true })
  assuranceNumero: string;

  @Column({ type: 'date', nullable: true })
  assuranceExpiration: Date;

  // Timestamps
  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  // Relations (à définir avec d'autres modules)
  // @OneToMany(() => Consultation, consultation => consultation.patient)
  // consultations: Consultation[];

  // @OneToMany(() => MedicalRecord, record => record.patient)
  // medicalRecords: MedicalRecord[];

  // Méthode helper pour calculer l'âge
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
