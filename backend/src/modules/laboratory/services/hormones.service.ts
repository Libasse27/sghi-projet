import { Injectable } from '@nestjs/common';

@Injectable()
export class HormonesService {
  private readonly referenceRanges = {
    TSH: { min: 0.4, max: 4.0, unit: 'mIU/L' },
    T3: { min: 1.2, max: 2.8, unit: 'nmol/L' },
    T4: { min: 60, max: 120, unit: 'nmol/L' },
    CORTISOL_MORNING: { min: 140, max: 690, unit: 'nmol/L' },
    TESTOSTERONE_M: { min: 10, max: 30, unit: 'nmol/L' },
    TESTOSTERONE_F: { min: 0.5, max: 2.5, unit: 'nmol/L' },
    ESTRADIOL_F: { min: 40, max: 400, unit: 'pmol/L' },
    PROGESTERONE_F: { min: 5, max: 80, unit: 'nmol/L' },
  };

  interpretThyroidFunction(tsh: number, t3?: number, t4?: number): string {
    const interpretations: string[] = [];

    if (tsh > 4.0) {
      interpretations.push('Hypothyroïdie');
      if (tsh > 10) {
        interpretations.push('Hypothyroïdie manifeste');
      }
    } else if (tsh < 0.4) {
      interpretations.push('Hyperthyroïdie');
    }

    if (t4 && t4 < 60) {
      interpretations.push('T4 basse');
    } else if (t4 && t4 > 120) {
      interpretations.push('T4 élevée');
    }

    return interpretations.length > 0
      ? interpretations.join('. ')
      : 'Fonction thyroïdienne normale';
  }
}
