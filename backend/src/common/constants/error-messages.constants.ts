export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    UNAUTHORIZED: 'Non autorisé',
    TOKEN_EXPIRED: 'Token expiré',
    INVALID_TOKEN: 'Token invalide',
    ACCOUNT_DISABLED: 'Compte désactivé',
    ACCOUNT_LOCKED: 'Compte verrouillé',
    PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
    WEAK_PASSWORD: 'Le mot de passe est trop faible',
    EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé',
    PHONE_ALREADY_EXISTS: 'Ce numéro de téléphone est déjà utilisé',
    INVALID_VERIFICATION_CODE: 'Code de vérification invalide',
    VERIFICATION_CODE_EXPIRED: 'Code de vérification expiré',
  },

  // Authorization errors
  PERMISSION: {
    INSUFFICIENT_PERMISSIONS: 'Permissions insuffisantes',
    ACCESS_DENIED: 'Accès refusé',
    ROLE_REQUIRED: 'Rôle requis manquant',
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'Ce champ est requis',
    INVALID_EMAIL: 'Email invalide',
    INVALID_PHONE: 'Numéro de téléphone invalide',
    INVALID_DATE: 'Date invalide',
    INVALID_FORMAT: 'Format invalide',
    MIN_LENGTH: 'Longueur minimale non respectée',
    MAX_LENGTH: 'Longueur maximale dépassée',
    INVALID_UUID: 'UUID invalide',
    INVALID_NUMBER: 'Nombre invalide',
    OUT_OF_RANGE: 'Valeur hors plage',
  },

  // Patient errors
  PATIENT: {
    NOT_FOUND: 'Patient non trouvé',
    ALREADY_EXISTS: 'Ce patient existe déjà',
    INVALID_AGE: 'Âge invalide',
    INVALID_BLOOD_GROUP: 'Groupe sanguin invalide',
    NATIONAL_ID_EXISTS: 'Numéro d\'identité nationale déjà utilisé',
  },

  // Appointment errors
  APPOINTMENT: {
    NOT_FOUND: 'Rendez-vous non trouvé',
    ALREADY_BOOKED: 'Ce créneau est déjà réservé',
    TIME_CONFLICT: 'Conflit d\'horaire détecté',
    PAST_DATE: 'Impossible de créer un rendez-vous dans le passé',
    DOCTOR_UNAVAILABLE: 'Médecin non disponible',
    CANNOT_CANCEL: 'Impossible d\'annuler ce rendez-vous',
    ALREADY_CONFIRMED: 'Rendez-vous déjà confirmé',
  },

  // Consultation errors
  CONSULTATION: {
    NOT_FOUND: 'Consultation non trouvée',
    ALREADY_STARTED: 'Consultation déjà commencée',
    ALREADY_COMPLETED: 'Consultation déjà terminée',
    NOT_STARTED: 'Consultation non commencée',
    INVALID_STATUS: 'Statut invalide',
  },

  // Emergency errors
  EMERGENCY: {
    NOT_FOUND: 'Cas d\'urgence non trouvé',
    INVALID_PRIORITY: 'Priorité invalide',
    ALREADY_DISCHARGED: 'Patient déjà sorti',
    TRIAGE_REQUIRED: 'Triage requis',
  },

  // Laboratory errors
  LABORATORY: {
    ANALYSIS_NOT_FOUND: 'Analyse non trouvée',
    SAMPLE_NOT_FOUND: 'Échantillon non trouvé',
    RESULT_NOT_FOUND: 'Résultat non trouvé',
    ALREADY_VALIDATED: 'Déjà validé',
    INVALID_SAMPLE_STATUS: 'Statut d\'échantillon invalide',
    INSUFFICIENT_SAMPLE: 'Échantillon insuffisant',
  },

  // Imaging errors
  IMAGING: {
    EXAM_NOT_FOUND: 'Examen non trouvé',
    REPORT_NOT_FOUND: 'Rapport non trouvé',
    INVALID_MODALITY: 'Modalité invalide',
    ALREADY_REPORTED: 'Rapport déjà créé',
  },

  // Hospitalization errors
  HOSPITALIZATION: {
    BED_NOT_FOUND: 'Lit non trouvé',
    BED_OCCUPIED: 'Lit occupé',
    BED_NOT_AVAILABLE: 'Lit non disponible',
    ADMISSION_NOT_FOUND: 'Admission non trouvée',
    ALREADY_DISCHARGED: 'Patient déjà sorti',
    ROOM_FULL: 'Chambre pleine',
  },

  // Pharmacy errors
  PHARMACY: {
    MEDICINE_NOT_FOUND: 'Médicament non trouvé',
    INSUFFICIENT_STOCK: 'Stock insuffisant',
    OUT_OF_STOCK: 'Rupture de stock',
    EXPIRED_MEDICINE: 'Médicament expiré',
    INVALID_DOSAGE: 'Dosage invalide',
    DRUG_INTERACTION: 'Interaction médicamenteuse détectée',
    PRESCRIPTION_REQUIRED: 'Ordonnance requise',
  },

  // Surgery errors
  SURGERY: {
    NOT_FOUND: 'Chirurgie non trouvée',
    OR_NOT_AVAILABLE: 'Salle d\'opération non disponible',
    SURGEON_UNAVAILABLE: 'Chirurgien non disponible',
    TIME_CONFLICT: 'Conflit d\'horaire',
    ALREADY_STARTED: 'Chirurgie déjà commencée',
    ALREADY_COMPLETED: 'Chirurgie déjà terminée',
    CANNOT_CANCEL: 'Impossible d\'annuler',
  },

  // Billing errors
  BILLING: {
    INVOICE_NOT_FOUND: 'Facture non trouvée',
    PAYMENT_NOT_FOUND: 'Paiement non trouvé',
    ALREADY_PAID: 'Déjà payé',
    INSUFFICIENT_AMOUNT: 'Montant insuffisant',
    PAYMENT_FAILED: 'Paiement échoué',
    INVALID_PAYMENT_METHOD: 'Méthode de paiement invalide',
    INVOICE_OVERDUE: 'Facture en retard',
  },

  // HR errors
  HR: {
    EMPLOYEE_NOT_FOUND: 'Employé non trouvé',
    SCHEDULE_CONFLICT: 'Conflit d\'horaire',
    ALREADY_CHECKED_IN: 'Déjà pointé',
    ALREADY_CHECKED_OUT: 'Déjà dépointé',
    INSUFFICIENT_LEAVE: 'Congés insuffisants',
    ALREADY_TERMINATED: 'Déjà licencié',
  },

  // File upload errors
  FILE: {
    TOO_LARGE: 'Fichier trop volumineux',
    INVALID_TYPE: 'Type de fichier invalide',
    UPLOAD_FAILED: 'Échec du téléchargement',
    NOT_FOUND: 'Fichier non trouvé',
    CORRUPT: 'Fichier corrompu',
  },

  // General errors
  GENERAL: {
    NOT_FOUND: 'Ressource non trouvée',
    BAD_REQUEST: 'Requête invalide',
    INTERNAL_SERVER_ERROR: 'Erreur interne du serveur',
    SERVICE_UNAVAILABLE: 'Service indisponible',
    TIMEOUT: 'Délai d\'attente dépassé',
    CONFLICT: 'Conflit détecté',
    DUPLICATE_ENTRY: 'Entrée dupliquée',
    OPERATION_FAILED: 'Opération échouée',
  },

  // Rate limit errors
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'Trop de requêtes',
    RETRY_AFTER: 'Veuillez réessayer plus tard',
  },

  // Database errors
  DATABASE: {
    CONNECTION_ERROR: 'Erreur de connexion à la base de données',
    QUERY_ERROR: 'Erreur de requête',
    TRANSACTION_FAILED: 'Transaction échouée',
    CONSTRAINT_VIOLATION: 'Violation de contrainte',
  },
};

export const SUCCESS_MESSAGES = {
  // General
  CREATED: 'Créé avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
  OPERATION_SUCCESS: 'Opération réussie',

  // Authentication
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTRATION_SUCCESS: 'Inscription réussie',
  PASSWORD_RESET: 'Mot de passe réinitialisé',
  PASSWORD_CHANGED: 'Mot de passe modifié',
  EMAIL_VERIFIED: 'Email vérifié',

  // Appointment
  APPOINTMENT_BOOKED: 'Rendez-vous réservé',
  APPOINTMENT_CONFIRMED: 'Rendez-vous confirmé',
  APPOINTMENT_CANCELLED: 'Rendez-vous annulé',

  // Consultation
  CONSULTATION_STARTED: 'Consultation commencée',
  CONSULTATION_COMPLETED: 'Consultation terminée',

  // Payment
  PAYMENT_SUCCESS: 'Paiement réussi',
  INVOICE_SENT: 'Facture envoyée',

  // Notifications
  EMAIL_SENT: 'Email envoyé',
  SMS_SENT: 'SMS envoyé',
  NOTIFICATION_SENT: 'Notification envoyée',
};
