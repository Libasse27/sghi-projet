import { Injectable } from '@nestjs/common';

@Injectable()
export class BiochemistryService {
  private readonly referenceRanges = {
    // Fonction rénale
    CREATININE_M: { min: 62, max: 115, unit: 'µmol/L' },
    CREATININE_F: { min: 53, max: 97, unit: 'µmol/L' },
    UREA: { min: 2.5, max: 7.5, unit: 'mmol/L' },
    URIC_ACID_M: { min: 208, max: 428, unit: 'µmol/L' },
    URIC_ACID_F: { min: 155, max: 357, unit: 'µmol/L' },

    // Fonction hépatique
    ALT: { min: 7, max: 56, unit: 'U/L' },
    AST: { min: 10, max: 40, unit: 'U/L' },
    ALP: { min: 40, max: 150, unit: 'U/L' },
    GGT_M: { min: 8, max: 61, unit: 'U/L' },
    GGT_F: { min: 5, max: 36, unit: 'U/L' },
    BILIRUBIN_TOTAL: { min: 5, max: 21, unit: 'µmol/L' },
    BILIRUBIN_DIRECT: { min: 0, max: 5, unit: 'µmol/L' },
    ALBUMIN: { min: 35, max: 50, unit: 'g/L' },
    TOTAL_PROTEIN: { min: 60, max: 80, unit: 'g/L' },

    // Lipides
    CHOLESTEROL_TOTAL: { min: 0, max: 5.2, unit: 'mmol/L' },
    LDL_CHOLESTEROL: { min: 0, max: 3.4, unit: 'mmol/L' },
    HDL_CHOLESTEROL_M: { min: 1.0, max: 999, unit: 'mmol/L' },
    HDL_CHOLESTEROL_F: { min: 1.2, max: 999, unit: 'mmol/L' },
    TRIGLYCERIDES: { min: 0, max: 1.7, unit: 'mmol/L' },

    // Glucose
    GLUCOSE_FASTING: { min: 3.9, max: 5.6, unit: 'mmol/L' },
    HBA1C: { min: 4.0, max: 5.6, unit: '%' },

    // Électrolytes
    SODIUM: { min: 136, max: 145, unit: 'mmol/L' },
    POTASSIUM: { min: 3.5, max: 5.1, unit: 'mmol/L' },
    CHLORIDE: { min: 98, max: 107, unit: 'mmol/L' },
    CALCIUM: { min: 2.2, max: 2.6, unit: 'mmol/L' },
    MAGNESIUM: { min: 0.7, max: 1.0, unit: 'mmol/L' },
    PHOSPHATE: { min: 0.8, max: 1.5, unit: 'mmol/L' },
  };

  analyzeResult(testCode: string, value: number, patientSex: 'M' | 'F'): any {
    const sexSuffix = patientSex === 'M' ? '_M' : '_F';
    const testKey = testCode + sexSuffix;

    const reference = this.referenceRanges[testKey] || this.referenceRanges[testCode];

    if (!reference) {
      throw new Error(`Unknown test code: ${testCode}`);
    }

    const isAbnormal = value < reference.min || value > reference.max;
    const referenceRange = `${reference.min}-${reference.max}`;

    return {
      testName: this.getTestName(testCode),
      value,
      unit: reference.unit,
      referenceRange,
      isAbnormal,
      isCritical: this.isCriticalValue(testCode, value),
    };
  }

  interpretLiverFunction(results: any): string {
    const interpretations: string[] = [];

    if (results.ALT > 56 || results.AST > 40) {
      const ratio = results.AST / results.ALT;

      if (ratio > 2) {
        interpretations.push('Cytolyse hépatique (alcool ou cirrhose possible)');
      } else if (ratio < 1) {
        interpretations.push('Cytolyse hépatique (hépatite ou stéatose possible)');
      }

      if (results.ALT > 10 * 56) {
        interpretations.push('ALERTE: Cytolyse sévère');
      }
    }

    if (results.GGT > (results.GGT_M ? 61 : 36)) {
      interpretations.push('Cholestase ou consommation alcool');
    }

    if (results.BILIRUBIN_TOTAL > 21) {
      interpretations.push('Hyperbilirubinémie (ictère possible)');
    }

    if (results.ALBUMIN < 35) {
      interpretations.push('Hypoalbuminémie (insuffisance hépatique ou malnutrition)');
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Fonction hépatique normale';
  }

  interpretRenalFunction(results: any, patientSex: 'M' | 'F'): string {
    const interpretations: string[] = [];

    const creatRef = patientSex === 'M' ? this.referenceRanges.CREATININE_M : this.referenceRanges.CREATININE_F;

    if (results.CREATININE > creatRef.max) {
      interpretations.push('Insuffisance rénale possible');

      if (results.CREATININE > creatRef.max * 3) {
        interpretations.push('ALERTE: Insuffisance rénale sévère');
      }
    }

    if (results.UREA > 7.5) {
      interpretations.push('Azotémie élevée');
    }

    if (results.POTASSIUM > 5.5) {
      interpretations.push('ALERTE: Hyperkaliémie - risque cardiaque');
    } else if (results.POTASSIUM < 3.0) {
      interpretations.push('ALERTE: Hypokaliémie sévère');
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Fonction rénale normale';
  }

  interpretLipidProfile(results: any): string {
    const interpretations: string[] = [];

    if (results.CHOLESTEROL_TOTAL > 5.2) {
      interpretations.push('Hypercholestérolémie');

      if (results.CHOLESTEROL_TOTAL > 6.2) {
        interpretations.push('Risque cardiovasculaire élevé');
      }
    }

    if (results.LDL_CHOLESTEROL > 3.4) {
      interpretations.push('LDL élevé (mauvais cholestérol)');
    }

    const hdlRef = results.patientSex === 'M' ? 1.0 : 1.2;
    if (results.HDL_CHOLESTEROL < hdlRef) {
      interpretations.push('HDL bas (risque cardiovasculaire)');
    }

    if (results.TRIGLYCERIDES > 1.7) {
      interpretations.push('Hypertriglycéridémie');

      if (results.TRIGLYCERIDES > 5.0) {
        interpretations.push('Risque de pancréatite aiguë');
      }
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Profil lipidique normal';
  }

  interpretDiabetes(results: any): string {
    const interpretations: string[] = [];

    if (results.GLUCOSE_FASTING) {
      if (results.GLUCOSE_FASTING >= 7.0) {
        interpretations.push('Diabète confirmé');
      } else if (results.GLUCOSE_FASTING >= 5.6 && results.GLUCOSE_FASTING < 7.0) {
        interpretations.push('Prédiabète (glycémie à jeun altérée)');
      }
    }

    if (results.HBA1C) {
      if (results.HBA1C >= 6.5) {
        interpretations.push('Diabète confirmé (HbA1c)');
      } else if (results.HBA1C >= 5.7 && results.HBA1C < 6.5) {
        interpretations.push('Prédiabète détecté');
      }

      if (results.HBA1C > 9.0) {
        interpretations.push('ALERTE: Diabète mal contrôlé');
      }
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Glycémie normale';
  }

  private isCriticalValue(testCode: string, value: number): boolean {
    const criticalValues = {
      POTASSIUM: { low: 2.5, high: 6.5 },
      SODIUM: { low: 120, high: 160 },
      CALCIUM: { low: 1.5, high: 3.5 },
      GLUCOSE_FASTING: { low: 2.2, high: 27.8 },
      CREATININE_M: { low: null, high: 500 },
      CREATININE_F: { low: null, high: 500 },
    };

    const critical = criticalValues[testCode.replace('_M', '').replace('_F', '')];
    if (!critical) return false;

    return (critical.low !== null && value < critical.low) || (critical.high !== null && value > critical.high);
  }

  private getTestName(code: string): string {
    const names = {
      CREATININE: 'Créatinine',
      UREA: 'Urée',
      URIC_ACID: 'Acide urique',
      ALT: 'ALAT',
      AST: 'ASAT',
      ALP: 'Phosphatase alcaline',
      GGT: 'Gamma-GT',
      BILIRUBIN_TOTAL: 'Bilirubine totale',
      BILIRUBIN_DIRECT: 'Bilirubine directe',
      ALBUMIN: 'Albumine',
      TOTAL_PROTEIN: 'Protéines totales',
      CHOLESTEROL_TOTAL: 'Cholestérol total',
      LDL_CHOLESTEROL: 'LDL-Cholestérol',
      HDL_CHOLESTEROL: 'HDL-Cholestérol',
      TRIGLYCERIDES: 'Triglycérides',
      GLUCOSE_FASTING: 'Glycémie à jeun',
      HBA1C: 'HbA1c',
      SODIUM: 'Sodium',
      POTASSIUM: 'Potassium',
      CHLORIDE: 'Chlorure',
      CALCIUM: 'Calcium',
      MAGNESIUM: 'Magnésium',
      PHOSPHATE: 'Phosphate',
    };

    return names[code.replace('_M', '').replace('_F', '')] || code;
  }
}
