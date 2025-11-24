/**
 * Constantes médicales pour le système SGHI
 */

/**
 * Spécialités médicales
 */
export enum MedicalSpecialty {
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  CARDIOLOGY = 'CARDIOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  UROLOGY = 'UROLOGY',
  NEUROLOGY = 'NEUROLOGY',
  PEDIATRICS = 'PEDIATRICS',
  GYNECOLOGY = 'GYNECOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  DERMATOLOGY = 'DERMATOLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  ENT = 'ENT', // Oto-Rhino-Laryngologie
  PSYCHIATRY = 'PSYCHIATRY',
  RADIOLOGY = 'RADIOLOGY',
  ANESTHESIOLOGY = 'ANESTHESIOLOGY',
  EMERGENCY = 'EMERGENCY',
  SURGERY = 'SURGERY',
}

/**
 * Niveaux de triage d'urgence (CIMU)
 */
export enum TriageLevel {
  P1 = 'P1', // Urgence vitale - Rouge - Immédiat
  P2 = 'P2', // Très urgent - Orange - 10-15 min
  P3 = 'P3', // Urgent - Jaune - 60 min
  P4 = 'P4', // Moins urgent - Vert - 120 min
  P5 = 'P5', // Non urgent - Bleu - 240 min
}

export const TRIAGE_CONFIG = {
  [TriageLevel.P1]: {
    color: '#EF4444', // Rouge
    delay: 'Immédiat',
    description: 'Urgence vitale',
    maxWaitTime: 0,
  },
  [TriageLevel.P2]: {
    color: '#F97316', // Orange
    delay: '10-15 min',
    description: 'Très urgent',
    maxWaitTime: 15,
  },
  [TriageLevel.P3]: {
    color: '#EAB308', // Jaune
    delay: '60 min',
    description: 'Urgent',
    maxWaitTime: 60,
  },
  [TriageLevel.P4]: {
    color: '#22C55E', // Vert
    delay: '120 min',
    description: 'Moins urgent',
    maxWaitTime: 120,
  },
  [TriageLevel.P5]: {
    color: '#3B82F6', // Bleu
    delay: '240 min',
    description: 'Non urgent',
    maxWaitTime: 240,
  },
};

/**
 * Groupes sanguins
 */
export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * Types d'analyses de laboratoire
 */
export enum LabAnalysisCategory {
  HEMATOLOGY = 'HEMATOLOGY',
  BIOCHEMISTRY = 'BIOCHEMISTRY',
  SEROLOGY = 'SEROLOGY',
  BACTERIOLOGY = 'BACTERIOLOGY',
  HORMONES = 'HORMONES',
  BIOPSY = 'BIOPSY',
}

/**
 * Analyses d'hématologie
 */
export const HEMATOLOGY_TESTS = [
  'NFS', // Numération formule sanguine
  'VS', // Vitesse de sédimentation
  'Groupe sanguin',
  'TP/TCA', // Taux de prothrombine / Temps de céphaline activée
  'D-Dimères',
  'Fibrinogène',
  'Réticulocytes',
  'Frottis sanguin',
];

/**
 * Analyses de biochimie
 */
export const BIOCHEMISTRY_TESTS = [
  'Glycémie',
  'Urée',
  'Créatinine',
  'Ionogramme sanguin',
  'Bilan hépatique',
  'Bilan lipidique',
  'CRP',
  'Acide urique',
  'Calcium',
  'Phosphore',
  'Magnésium',
];

/**
 * Analyses de sérologie
 */
export const SEROLOGY_TESTS = [
  'HIV',
  'Hépatite B',
  'Hépatite C',
  'Syphilis',
  'COVID-19',
  'Toxoplasmose',
  'Rubéole',
  'CMV',
];

/**
 * Analyses de bactériologie
 */
export const BACTERIOLOGY_TESTS = [
  'ECBU',
  'Hémoculture',
  'Prélèvement gorge',
  'Coproculture',
  'Antibiogramme',
  'Prélèvement vaginal',
  'Prélèvement urétral',
];

/**
 * Analyses hormonales
 */
export const HORMONE_TESTS = [
  'TSH',
  'T3/T4',
  'Cortisol',
  'Prolactine',
  'βHCG',
  'PSA',
  'Testostérone',
  'FSH/LH',
  'Estradiol',
  'Progestérone',
];

/**
 * Types d'examens d'imagerie
 */
export enum ImagingType {
  X_RAY = 'X_RAY',
  ULTRASOUND = 'ULTRASOUND',
  CT_SCAN = 'CT_SCAN',
  MRI = 'MRI',
  MAMMOGRAPHY = 'MAMMOGRAPHY',
  PANORAMIC = 'PANORAMIC',
  DOPPLER = 'DOPPLER',
}

/**
 * Types de prestations de kinésithérapie
 */
export enum PhysiotherapyCategory {
  UPPER_LIMB = 'UPPER_LIMB',
  LOWER_LIMB = 'LOWER_LIMB',
  TRUNK_SPINE = 'TRUNK_SPINE',
  SPECIALIZED = 'SPECIALIZED',
  ASSESSMENT = 'ASSESSMENT',
}

export const PHYSIOTHERAPY_SERVICES = {
  [PhysiotherapyCategory.UPPER_LIMB]: [
    'Rééducation interphalangienne',
    'Rééducation doigts',
    'Bilan neuromusculaire 1 membre',
    'Bilan ostéoarticulaire 1 membre',
  ],
  [PhysiotherapyCategory.LOWER_LIMB]: [
    'Rééducation pied/cheville/orteil',
    'Rééducation affections vasculaires',
    'Rééducation amputation 1 membre',
  ],
  [PhysiotherapyCategory.TRUNK_SPINE]: [
    'Kinésithérapie respiratoire',
    'Rééducation tronc-abdomen',
    'Rééducation périnéale',
  ],
  [PhysiotherapyCategory.SPECIALIZED]: [
    'Massage un membre',
    'Massage tronc ou plusieurs membres',
    'Rééducation déambulation sujet âgé',
    'Rééducation post brûlure',
    'Rééducation hémiplégie',
  ],
  [PhysiotherapyCategory.ASSESSMENT]: [
    'Bilan ostéoarticulaire corps',
    'Bilan neuromusculaire deux membres',
    'Consultation médecin kinésithérapeute',
  ],
};

/**
 * Statuts de lit d'hospitalisation
 */
export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  ISOLATION = 'ISOLATION',
}

/**
 * Services d'hospitalisation
 */
export enum HospitalizationService {
  MEDICINE = 'MEDICINE',
  SURGERY = 'SURGERY',
  MATERNITY = 'MATERNITY',
  PEDIATRICS = 'PEDIATRICS',
  ICU = 'ICU',
  EMERGENCY = 'EMERGENCY',
}

/**
 * Voies d'administration des médicaments
 */
export enum MedicationRoute {
  ORAL = 'ORAL',
  INTRAVENOUS = 'INTRAVENOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  TOPICAL = 'TOPICAL',
  RECTAL = 'RECTAL',
  INHALATION = 'INHALATION',
  SUBLINGUAL = 'SUBLINGUAL',
  TRANSDERMAL = 'TRANSDERMAL',
}

/**
 * Statuts de consultation
 */
export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

/**
 * Types de documents médicaux
 */
export enum MedicalDocumentType {
  PRESCRIPTION = 'PRESCRIPTION',
  MEDICAL_CERTIFICATE = 'MEDICAL_CERTIFICATE',
  SICK_LEAVE = 'SICK_LEAVE',
  MEDICAL_REPORT = 'MEDICAL_REPORT',
  LAB_RESULT = 'LAB_RESULT',
  IMAGING_REPORT = 'IMAGING_REPORT',
  CONSENT_FORM = 'CONSENT_FORM',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
}

/**
 * Genres
 */
export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'OTHER',
}

/**
 * Statuts de paiement
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

/**
 * Méthodes de paiement
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  ORANGE_MONEY = 'ORANGE_MONEY',
  WAVE = 'WAVE',
  FREE_MONEY = 'FREE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  INSURANCE = 'INSURANCE',
}
