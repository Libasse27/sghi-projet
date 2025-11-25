export const REGEX_PATTERNS = {
  // Email validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Phone number patterns
  PHONE: {
    // Senegal phone numbers: +221 XX XXX XX XX or XX XXX XX XX
    SENEGAL: /^(\+221)?[337][0357678]\d{7}$/,
    // Orange Senegal: 77, 78
    ORANGE: /^(\+221)?(77|78)\d{7}$/,
    // Free Senegal: 76
    FREE: /^(\+221)?76\d{7}$/,
    // Expresso Senegal: 70
    EXPRESSO: /^(\+221)?70\d{7}$/,
    // Tigo (now Free): 75
    TIGO: /^(\+221)?75\d{7}$/,
    // Landline: 33
    LANDLINE: /^(\+221)?33\d{7}$/,
    // International format
    INTERNATIONAL: /^\+\d{1,3}\d{6,14}$/,
  },

  // Password validation
  PASSWORD: {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    // At least 12 characters, multiple character types
    VERY_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]).{12,}$/,
  },

  // Name validation
  NAME: {
    // Letters, spaces, hyphens, apostrophes
    PERSON_NAME: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
    // Alphanumeric with spaces
    GENERAL: /^[a-zA-Z0-9À-ÿ\s'-]{2,100}$/,
  },

  // Date formats
  DATE: {
    // YYYY-MM-DD
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    // DD/MM/YYYY
    FRENCH: /^\d{2}\/\d{2}\/\d{4}$/,
    // MM/DD/YYYY
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    // YYYY-MM-DD HH:mm:ss
    DATETIME: /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
  },

  // Time formats
  TIME: {
    // HH:mm (24-hour)
    HOUR_MINUTE: /^([01]\d|2[0-3]):([0-5]\d)$/,
    // HH:mm:ss (24-hour)
    HOUR_MINUTE_SECOND: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
    // HH:mm AM/PM (12-hour)
    TWELVE_HOUR: /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i,
  },

  // Identification numbers
  ID: {
    // UUID v4
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    // Senegal National ID (13 digits)
    SENEGAL_NATIONAL_ID: /^\d{13}$/,
    // Passport number (alphanumeric, 6-9 characters)
    PASSPORT: /^[A-Z0-9]{6,9}$/,
  },

  // Medical codes
  MEDICAL: {
    // Blood group
    BLOOD_GROUP: /^(A|B|AB|O)[+-]$/,
    // ICD-10 code
    ICD10: /^[A-Z]\d{2}(\.\d{1,2})?$/,
    // Medicine dosage (e.g., 500mg, 2.5ml, 1tablet)
    DOSAGE: /^\d+(\.\d+)?\s?(mg|g|ml|l|tablet|capsule|drops?|unit)s?$/i,
  },

  // Financial
  FINANCIAL: {
    // Amount (e.g., 1000, 1000.50, 1,000.50)
    AMOUNT: /^\d{1,3}(,?\d{3})*(\.\d{2})?$/,
    // Credit card number (basic validation)
    CREDIT_CARD: /^\d{13,19}$/,
    // CVV
    CVV: /^\d{3,4}$/,
  },

  // Address
  ADDRESS: {
    // Postal code (various formats)
    POSTAL_CODE: /^\d{4,6}$/,
    // Street address
    STREET: /^[a-zA-Z0-9À-ÿ\s,.-]{5,100}$/,
  },

  // URL patterns
  URL: {
    // HTTP/HTTPS URL
    WEB: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    // Domain name
    DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
  },

  // File validation
  FILE: {
    // Image extensions
    IMAGE: /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i,
    // Document extensions
    DOCUMENT: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i,
    // Video extensions
    VIDEO: /\.(mp4|avi|mov|wmv|flv|mkv)$/i,
    // Audio extensions
    AUDIO: /\.(mp3|wav|ogg|m4a|flac)$/i,
  },

  // Code validation
  CODE: {
    // Verification code (6 digits)
    VERIFICATION: /^\d{6}$/,
    // PIN code (4-8 digits)
    PIN: /^\d{4,8}$/,
    // OTP (4-8 alphanumeric)
    OTP: /^[A-Z0-9]{4,8}$/,
  },

  // Hospital-specific patterns
  HOSPITAL: {
    // Patient number: PAT-YYYY-XXXXX
    PATIENT_NUMBER: /^PAT-\d{4}-\d{5}$/,
    // Consultation number: CONS-YYYYMMDD-XXXXX
    CONSULTATION_NUMBER: /^CONS-\d{8}-\d{5}$/,
    // Emergency number: URG-YYYY-XXXX
    EMERGENCY_NUMBER: /^URG-\d{4}-\d{4}$/,
    // Analysis number: AN-YYYY-XXXXX
    ANALYSIS_NUMBER: /^AN-\d{4}-\d{5}$/,
    // Surgery number: CHIR-YYYY-XXXXX
    SURGERY_NUMBER: /^CHIR-\d{4}-\d{5}$/,
    // Invoice number: FACT-YYYYMM-XXXXX
    INVOICE_NUMBER: /^FACT-\d{6}-\d{5}$/,
    // Payment number: PAY-YYYYMM-XXXXX
    PAYMENT_NUMBER: /^PAY-\d{6}-\d{5}$/,
    // Employee number: EMP-XXX##-XXXX
    EMPLOYEE_NUMBER: /^EMP-[A-Z]{3}\d{2}-\d{4}$/,
  },

  // Username validation
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,

  // IP address
  IP_ADDRESS: {
    V4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    V6: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  },

  // Color codes
  COLOR: {
    HEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    RGB: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
    RGBA: /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/,
  },
};

// Helper functions for validation
export class RegexValidator {
  /**
   * Validate email
   */
  static isValidEmail(email: string): boolean {
    return REGEX_PATTERNS.EMAIL.test(email);
  }

  /**
   * Validate Senegal phone number
   */
  static isValidSenegalPhone(phone: string): boolean {
    return REGEX_PATTERNS.PHONE.SENEGAL.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate password strength
   */
  static getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'very_strong' {
    if (REGEX_PATTERNS.PASSWORD.VERY_STRONG.test(password)) {
      return 'very_strong';
    } else if (REGEX_PATTERNS.PASSWORD.STRONG.test(password)) {
      return 'strong';
    } else if (REGEX_PATTERNS.PASSWORD.MEDIUM.test(password)) {
      return 'medium';
    }
    return 'weak';
  }

  /**
   * Validate UUID
   */
  static isValidUuid(uuid: string): boolean {
    return REGEX_PATTERNS.ID.UUID.test(uuid);
  }

  /**
   * Validate blood group
   */
  static isValidBloodGroup(bloodGroup: string): boolean {
    return REGEX_PATTERNS.MEDICAL.BLOOD_GROUP.test(bloodGroup);
  }

  /**
   * Sanitize and validate phone number
   */
  static sanitizePhone(phone: string): string {
    return phone.replace(/\s/g, '');
  }

  /**
   * Format phone number for display
   */
  static formatPhoneForDisplay(phone: string): string {
    const sanitized = this.sanitizePhone(phone);
    if (sanitized.startsWith('+221')) {
      const number = sanitized.substring(4);
      return `+221 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
    }
    return sanitized;
  }
}
