import { Injectable } from '@nestjs/common';

@Injectable()
export class BiopsyService {
  generateBiopsyReport(specimen: string, findings: string, diagnosis: string): string {
    return `
RAPPORT D'ANATOMIE PATHOLOGIQUE

Spécimen: ${specimen}

Examen macroscopique:
${findings}

Examen microscopique:
${diagnosis}

Conclusion: [À compléter par le pathologiste]
    `.trim();
  }

  interpretMalignancy(result: string): string {
    const interpretations = {
      BENIGN: 'Lésion bénigne',
      MALIGNANT: 'Lésion maligne - Prise en charge oncologique urgente',
      SUSPICIOUS: 'Lésion suspecte - Investigations complémentaires nécessaires',
      INDETERMINATE: 'Résultat indéterminé - Nouvelle biopsie recommandée',
    };

    return interpretations[result] || result;
  }
}
