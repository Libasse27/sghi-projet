/**
 * Rôles utilisateurs dans le système SGHI
 */
export enum UserRole {
  // Administration
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',

  // Personnel médical
  DOCTOR = 'DOCTOR',
  SPECIALIST = 'SPECIALIST',
  SURGEON = 'SURGEON',
  NURSE = 'NURSE',
  NURSE_CHIEF = 'NURSE_CHIEF',
  ANESTHESIOLOGIST = 'ANESTHESIOLOGIST',

  // Personnel paramédical
  PHYSIOTHERAPIST = 'PHYSIOTHERAPIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  RADIOLOGY_TECHNICIAN = 'RADIOLOGY_TECHNICIAN',
  BIOLOGIST = 'BIOLOGIST',

  // Personnel administratif
  RECEPTIONIST = 'RECEPTIONIST',
  ACCOUNTANT = 'ACCOUNTANT',
  HR_MANAGER = 'HR_MANAGER',

  // Patients et externe
  PATIENT = 'PATIENT',
  PATIENT_FAMILY = 'PATIENT_FAMILY',
}

/**
 * Permissions granulaires du système
 */
export enum Permission {
  // Patients
  PATIENTS_VIEW = 'patients:view',
  PATIENTS_CREATE = 'patients:create',
  PATIENTS_UPDATE = 'patients:update',
  PATIENTS_DELETE = 'patients:delete',
  PATIENTS_VIEW_ALL = 'patients:view:all',

  // Consultations
  CONSULTATIONS_VIEW = 'consultations:view',
  CONSULTATIONS_CREATE = 'consultations:create',
  CONSULTATIONS_UPDATE = 'consultations:update',
  CONSULTATIONS_DELETE = 'consultations:delete',

  // Urgences
  EMERGENCY_VIEW = 'emergency:view',
  EMERGENCY_MANAGE = 'emergency:manage',
  EMERGENCY_TRIAGE = 'emergency:triage',

  // Laboratoire
  LAB_VIEW = 'lab:view',
  LAB_REQUEST = 'lab:request',
  LAB_ENTER_RESULTS = 'lab:enter_results',
  LAB_VALIDATE = 'lab:validate',

  // Imagerie
  IMAGING_VIEW = 'imaging:view',
  IMAGING_REQUEST = 'imaging:request',
  IMAGING_UPLOAD = 'imaging:upload',
  IMAGING_REPORT = 'imaging:report',

  // Hospitalisation
  HOSPITALIZATION_VIEW = 'hospitalization:view',
  HOSPITALIZATION_MANAGE = 'hospitalization:manage',
  BEDS_MANAGE = 'beds:manage',

  // Pharmacie
  PHARMACY_VIEW = 'pharmacy:view',
  PHARMACY_DISPENSE = 'pharmacy:dispense',
  PHARMACY_MANAGE_STOCK = 'pharmacy:manage_stock',
  PHARMACY_VALIDATE = 'pharmacy:validate',

  // Bloc opératoire
  SURGERY_VIEW = 'surgery:view',
  SURGERY_SCHEDULE = 'surgery:schedule',
  SURGERY_PERFORM = 'surgery:perform',

  // Facturation
  BILLING_VIEW = 'billing:view',
  BILLING_CREATE = 'billing:create',
  BILLING_UPDATE = 'billing:update',
  BILLING_VIEW_ALL = 'billing:view:all',
  PAYMENTS_PROCESS = 'payments:process',

  // RH
  HR_VIEW = 'hr:view',
  HR_MANAGE = 'hr:manage',
  HR_PAYROLL = 'hr:payroll',

  // Statistiques
  STATS_VIEW = 'stats:view',
  STATS_EXPORT = 'stats:export',
  REPORTS_GENERATE = 'reports:generate',

  // Administration
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',
  SETTINGS_MANAGE = 'settings:manage',
  SYSTEM_CONFIG = 'system:config',
}

/**
 * Mapping des rôles vers leurs permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  [UserRole.ADMIN]: [
    Permission.PATIENTS_VIEW_ALL,
    Permission.CONSULTATIONS_VIEW,
    Permission.EMERGENCY_VIEW,
    Permission.LAB_VIEW,
    Permission.IMAGING_VIEW,
    Permission.HOSPITALIZATION_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.SURGERY_VIEW,
    Permission.BILLING_VIEW_ALL,
    Permission.HR_VIEW,
    Permission.STATS_VIEW,
    Permission.STATS_EXPORT,
    Permission.REPORTS_GENERATE,
    Permission.USERS_MANAGE,
  ],

  [UserRole.DOCTOR]: [
    Permission.PATIENTS_VIEW,
    Permission.PATIENTS_CREATE,
    Permission.PATIENTS_UPDATE,
    Permission.CONSULTATIONS_VIEW,
    Permission.CONSULTATIONS_CREATE,
    Permission.CONSULTATIONS_UPDATE,
    Permission.LAB_VIEW,
    Permission.LAB_REQUEST,
    Permission.IMAGING_VIEW,
    Permission.IMAGING_REQUEST,
    Permission.HOSPITALIZATION_VIEW,
    Permission.HOSPITALIZATION_MANAGE,
  ],

  [UserRole.SPECIALIST]: [
    Permission.PATIENTS_VIEW,
    Permission.PATIENTS_UPDATE,
    Permission.CONSULTATIONS_VIEW,
    Permission.CONSULTATIONS_CREATE,
    Permission.CONSULTATIONS_UPDATE,
    Permission.LAB_VIEW,
    Permission.LAB_REQUEST,
    Permission.IMAGING_VIEW,
    Permission.IMAGING_REQUEST,
  ],

  [UserRole.SURGEON]: [
    Permission.PATIENTS_VIEW,
    Permission.CONSULTATIONS_VIEW,
    Permission.SURGERY_VIEW,
    Permission.SURGERY_SCHEDULE,
    Permission.SURGERY_PERFORM,
    Permission.LAB_VIEW,
    Permission.IMAGING_VIEW,
  ],

  [UserRole.NURSE]: [
    Permission.PATIENTS_VIEW,
    Permission.CONSULTATIONS_VIEW,
    Permission.EMERGENCY_VIEW,
    Permission.EMERGENCY_TRIAGE,
    Permission.HOSPITALIZATION_VIEW,
    Permission.PHARMACY_VIEW,
  ],

  [UserRole.NURSE_CHIEF]: [
    Permission.PATIENTS_VIEW,
    Permission.CONSULTATIONS_VIEW,
    Permission.EMERGENCY_VIEW,
    Permission.EMERGENCY_MANAGE,
    Permission.HOSPITALIZATION_VIEW,
    Permission.HOSPITALIZATION_MANAGE,
    Permission.BEDS_MANAGE,
    Permission.PHARMACY_VIEW,
  ],

  [UserRole.ANESTHESIOLOGIST]: [
    Permission.PATIENTS_VIEW,
    Permission.SURGERY_VIEW,
    Permission.SURGERY_SCHEDULE,
    Permission.LAB_VIEW,
  ],

  [UserRole.PHYSIOTHERAPIST]: [
    Permission.PATIENTS_VIEW,
    Permission.CONSULTATIONS_VIEW,
  ],

  [UserRole.PHARMACIST]: [
    Permission.PATIENTS_VIEW,
    Permission.PHARMACY_VIEW,
    Permission.PHARMACY_DISPENSE,
    Permission.PHARMACY_MANAGE_STOCK,
    Permission.PHARMACY_VALIDATE,
  ],

  [UserRole.LAB_TECHNICIAN]: [
    Permission.LAB_VIEW,
    Permission.LAB_ENTER_RESULTS,
  ],

  [UserRole.RADIOLOGY_TECHNICIAN]: [
    Permission.IMAGING_VIEW,
    Permission.IMAGING_UPLOAD,
  ],

  [UserRole.BIOLOGIST]: [
    Permission.LAB_VIEW,
    Permission.LAB_VALIDATE,
  ],

  [UserRole.RECEPTIONIST]: [
    Permission.PATIENTS_VIEW,
    Permission.PATIENTS_CREATE,
    Permission.PATIENTS_UPDATE,
    Permission.CONSULTATIONS_VIEW,
    Permission.CONSULTATIONS_CREATE,
    Permission.BILLING_VIEW,
    Permission.BILLING_CREATE,
    Permission.PAYMENTS_PROCESS,
  ],

  [UserRole.ACCOUNTANT]: [
    Permission.BILLING_VIEW_ALL,
    Permission.BILLING_UPDATE,
    Permission.PAYMENTS_PROCESS,
    Permission.STATS_VIEW,
    Permission.REPORTS_GENERATE,
  ],

  [UserRole.HR_MANAGER]: [
    Permission.HR_VIEW,
    Permission.HR_MANAGE,
    Permission.HR_PAYROLL,
    Permission.STATS_VIEW,
  ],

  [UserRole.PATIENT]: [],

  [UserRole.PATIENT_FAMILY]: [],
};

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Vérifie si un rôle a l'une des permissions listées
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Vérifie si un rôle a toutes les permissions listées
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}
