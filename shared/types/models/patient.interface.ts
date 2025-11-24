import { BloodGroup, Gender } from '../../constants/medical.constants';

/**
 * Interface Patient
 */
export interface IPatient {
  id: string;
  numeroPatient: string; // Numéro unique patient (NUP)

  // Informations personnelles
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: Gender;
  photo?: string;

  // Coordonnées
  telephone: string;
  telephoneSecondaire?: string;
  email?: string;
  adresse: IAdresse;

  // Informations médicales
  groupeSanguin?: BloodGroup;
  allergies: IAllergie[];
  antecedents: IAntecedent[];
  traitements?: ITraitement[];

  // Informations administratives
  profession?: string;
  situationMatrimoniale?: SituationMatrimoniale;
  nombreEnfants?: number;
  personneAContacter: IContactUrgence[];

  // Assurance
  assurance?: IAssurance;

  // Documents
  documents?: IDocument[];

  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  isActive: boolean;
}

/**
 * Interface Adresse
 */
export interface IAdresse {
  rue?: string;
  quartier: string;
  ville: string;
  region?: string;
  pays: string;
  codePostal?: string;
}

/**
 * Interface Allergie
 */
export interface IAllergie {
  id?: string;
  type: TypeAllergie;
  nom: string;
  severite: SeveriteAllergie;
  reaction?: string;
  dateDetection?: Date;
  note?: string;
}

export enum TypeAllergie {
  MEDICAMENT = 'MEDICAMENT',
  ALIMENTAIRE = 'ALIMENTAIRE',
  ENVIRONNEMENTALE = 'ENVIRONNEMENTALE',
  CONTACT = 'CONTACT',
  AUTRE = 'AUTRE',
}

export enum SeveriteAllergie {
  LEGERE = 'LEGERE',
  MODEREE = 'MODEREE',
  SEVERE = 'SEVERE',
  POTENTIELLEMENT_MORTELLE = 'POTENTIELLEMENT_MORTELLE',
}

/**
 * Interface Antécédent
 */
export interface IAntecedent {
  id?: string;
  type: TypeAntecedent;
  categorie?: string;
  description: string;
  date?: Date;
  traitement?: string;
  isActif: boolean;
  note?: string;
}

export enum TypeAntecedent {
  MEDICAL = 'MEDICAL',
  CHIRURGICAL = 'CHIRURGICAL',
  FAMILIAL = 'FAMILIAL',
  OBSTETRICAL = 'OBSTETRICAL',
  PSYCHIATRIQUE = 'PSYCHIATRIQUE',
}

/**
 * Interface Traitement en cours
 */
export interface ITraitement {
  id?: string;
  medicament: string;
  posologie: string;
  voieAdministration: string;
  frequence: string;
  dateDebut: Date;
  dateFin?: Date;
  indication: string;
  prescripteur?: string;
  isActif: boolean;
}

/**
 * Situation matrimoniale
 */
export enum SituationMatrimoniale {
  CELIBATAIRE = 'CELIBATAIRE',
  MARIE = 'MARIE',
  DIVORCE = 'DIVORCE',
  VEUF = 'VEUF',
  CONCUBINAGE = 'CONCUBINAGE',
}

/**
 * Interface Contact d'urgence
 */
export interface IContactUrgence {
  id?: string;
  nom: string;
  prenom: string;
  lien: LienFamilial;
  telephone: string;
  telephoneSecondaire?: string;
  adresse?: string;
  isPrincipal: boolean;
}

export enum LienFamilial {
  CONJOINT = 'CONJOINT',
  PARENT = 'PARENT',
  ENFANT = 'ENFANT',
  FRERE_SOEUR = 'FRERE_SOEUR',
  AMI = 'AMI',
  TUTEUR = 'TUTEUR',
  AUTRE = 'AUTRE',
}

/**
 * Interface Assurance
 */
export interface IAssurance {
  id?: string;
  compagnie: string;
  numeroPolice: string;
  typeAssurance: TypeAssurance;
  dateDebut: Date;
  dateFin?: Date;
  tauxPriseEnCharge: number; // Pourcentage (0-100)
  plafond?: number;
  beneficiaire: 'patient' | 'employeur';
  contact?: {
    telephone?: string;
    email?: string;
  };
  isActif: boolean;
}

export enum TypeAssurance {
  MUTUELLE = 'MUTUELLE',
  IPM = 'IPM', // Institut de Prévoyance Maladie
  CSS = 'CSS', // Caisse de Sécurité Sociale
  ASSURANCE_PRIVEE = 'ASSURANCE_PRIVEE',
  CMU = 'CMU', // Couverture Maladie Universelle
  AUTRE = 'AUTRE',
}

/**
 * Interface Document
 */
export interface IDocument {
  id?: string;
  type: TypeDocument;
  nom: string;
  url: string;
  mimeType: string;
  taille: number;
  dateUpload: Date;
  uploadedBy?: string;
  description?: string;
}

export enum TypeDocument {
  CARTE_IDENTITE = 'CARTE_IDENTITE',
  CARTE_ASSURANCE = 'CARTE_ASSURANCE',
  CARTE_VITALE = 'CARTE_VITALE',
  CERTIFICAT_MEDICAL = 'CERTIFICAT_MEDICAL',
  ORDONNANCE = 'ORDONNANCE',
  RESULTAT_ANALYSE = 'RESULTAT_ANALYSE',
  RESULTAT_IMAGERIE = 'RESULTAT_IMAGERIE',
  AUTRE = 'AUTRE',
}

/**
 * Interface pour la recherche de patients
 */
export interface IPatientSearchParams {
  query?: string;
  numeroPatient?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  dateNaissance?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Interface pour les statistiques patient
 */
export interface IPatientStats {
  totalConsultations: number;
  dernièreConsultation?: Date;
  prochaineConsultation?: Date;
  totalFactures: number;
  montantTotal: number;
  montantImpaye: number;
  totalHospitalisations: number;
  totalAnalyses: number;
  totalImageries: number;
}
