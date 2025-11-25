import { Injectable } from '@nestjs/common';

@Injectable()
export class SerologyService {
  interpretSerologyResult(testName: string, result: string): string {
    const interpretations = {
      HIV: {
        POSITIVE: 'VIH positif - Confirmation nécessaire',
        NEGATIVE: 'VIH négatif',
        INDETERMINATE: 'Résultat indéterminé - Retest requis',
      },
      HBsAg: {
        POSITIVE: 'Hépatite B active',
        NEGATIVE: 'Pas d\'hépatite B active',
      },
      HCV: {
        POSITIVE: 'Hépatite C - Confirmation par PCR nécessaire',
        NEGATIVE: 'Pas d\'hépatite C',
      },
      VDRL: {
        POSITIVE: 'Syphilis - Test de confirmation requis',
        NEGATIVE: 'Pas de syphilis détectée',
      },
    };

    return interpretations[testName]?.[result] || `${testName}: ${result}`;
  }
}
