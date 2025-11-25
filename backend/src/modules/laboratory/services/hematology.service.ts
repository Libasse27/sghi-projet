import { Injectable } from '@nestjs/common';

export interface HematologyTestResult {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

@Injectable()
export class HematologyService {
  private readonly referenceRanges = {
    // Numération globulaire complète (NFS)
    RBC_M: { min: 4.5, max: 5.5, unit: '10^12/L' }, // Homme
    RBC_F: { min: 4.0, max: 5.0, unit: '10^12/L' }, // Femme
    HGB_M: { min: 13.5, max: 17.5, unit: 'g/dL' }, // Hémoglobine homme
    HGB_F: { min: 12.0, max: 16.0, unit: 'g/dL' }, // Hémoglobine femme
    HCT_M: { min: 40, max: 52, unit: '%' }, // Hématocrite homme
    HCT_F: { min: 36, max: 46, unit: '%' }, // Hématocrite femme
    MCV: { min: 80, max: 100, unit: 'fL' }, // Volume globulaire moyen
    MCH: { min: 27, max: 32, unit: 'pg' }, // Teneur corpusculaire moyenne en Hb
    MCHC: { min: 32, max: 36, unit: 'g/dL' }, // Concentration corpusculaire moyenne en Hb
    WBC: { min: 4.0, max: 11.0, unit: '10^9/L' }, // Leucocytes
    NEUTROPHILS: { min: 2.0, max: 7.5, unit: '10^9/L' },
    LYMPHOCYTES: { min: 1.0, max: 4.0, unit: '10^9/L' },
    MONOCYTES: { min: 0.2, max: 0.8, unit: '10^9/L' },
    EOSINOPHILS: { min: 0.0, max: 0.5, unit: '10^9/L' },
    BASOPHILS: { min: 0.0, max: 0.2, unit: '10^9/L' },
    PLATELETS: { min: 150, max: 400, unit: '10^9/L' }, // Plaquettes
    // Coagulation
    PT: { min: 11, max: 13.5, unit: 'secondes' }, // Temps de prothrombine
    INR: { min: 0.8, max: 1.2, unit: '' },
    APTT: { min: 25, max: 35, unit: 'secondes' }, // TCA
    FIBRINOGEN: { min: 2.0, max: 4.0, unit: 'g/L' },
    // Vitesse de sédimentation
    ESR_M: { min: 0, max: 15, unit: 'mm/h' }, // Homme
    ESR_F: { min: 0, max: 20, unit: 'mm/h' }, // Femme
  };

  analyzeHematologyResults(
    testCode: string,
    value: number,
    patientSex: 'M' | 'F',
  ): HematologyTestResult {
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
    };
  }

  interpretCBC(results: any, patientSex: 'M' | 'F'): string {
    const interpretations: string[] = [];

    // Anémie
    const hgb = results.HGB || results.HGB_M || results.HGB_F;
    if (hgb) {
      const hgbRef = patientSex === 'M' ? this.referenceRanges.HGB_M : this.referenceRanges.HGB_F;
      if (hgb < hgbRef.min) {
        interpretations.push('Anémie détectée');
        if (results.MCV < 80) {
          interpretations.push('Anémie microcytaire (carence en fer possible)');
        } else if (results.MCV > 100) {
          interpretations.push('Anémie macrocytaire (carence en B12/folate possible)');
        }
      } else if (hgb > hgbRef.max) {
        interpretations.push('Polyglobulie');
      }
    }

    // Leucocytes
    if (results.WBC) {
      if (results.WBC > 11.0) {
        interpretations.push('Leucocytose (infection ou inflammation possible)');
      } else if (results.WBC < 4.0) {
        interpretations.push('Leucopénie');
      }
    }

    // Neutrophiles
    if (results.NEUTROPHILS) {
      if (results.NEUTROPHILS > 7.5) {
        interpretations.push('Neutrophilie (infection bactérienne possible)');
      } else if (results.NEUTROPHILS < 2.0) {
        interpretations.push('Neutropénie');
      }
    }

    // Lymphocytes
    if (results.LYMPHOCYTES) {
      if (results.LYMPHOCYTES > 4.0) {
        interpretations.push('Lymphocytose (infection virale possible)');
      } else if (results.LYMPHOCYTES < 1.0) {
        interpretations.push('Lymphopénie');
      }
    }

    // Plaquettes
    if (results.PLATELETS) {
      if (results.PLATELETS > 400) {
        interpretations.push('Thrombocytose');
      } else if (results.PLATELETS < 150) {
        interpretations.push('Thrombopénie');
        if (results.PLATELETS < 50) {
          interpretations.push('ALERTE: Thrombopénie sévère - risque hémorragique');
        }
      }
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Résultats dans les limites de la normale';
  }

  private getTestName(code: string): string {
    const names = {
      RBC: 'Globules rouges',
      HGB: 'Hémoglobine',
      HCT: 'Hématocrite',
      MCV: 'VGM',
      MCH: 'TCMH',
      MCHC: 'CCMH',
      WBC: 'Leucocytes',
      NEUTROPHILS: 'Neutrophiles',
      LYMPHOCYTES: 'Lymphocytes',
      MONOCYTES: 'Monocytes',
      EOSINOPHILS: 'Éosinophiles',
      BASOPHILS: 'Basophiles',
      PLATELETS: 'Plaquettes',
      PT: 'TP',
      INR: 'INR',
      APTT: 'TCA',
      FIBRINOGEN: 'Fibrinogène',
      ESR: 'VS',
    };

    return names[code.replace('_M', '').replace('_F', '')] || code;
  }
}
