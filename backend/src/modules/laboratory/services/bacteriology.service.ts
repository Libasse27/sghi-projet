import { Injectable } from '@nestjs/common';

@Injectable()
export class BacteriologyService {
  interpretCulture(organism: string, sensitivity: any): string {
    if (organism === 'NO_GROWTH') {
      return 'Pas de croissance bactérienne détectée';
    }

    const interpretations: string[] = [`Organisme détecté: ${organism}`];

    if (sensitivity && Object.keys(sensitivity).length > 0) {
      const resistant = Object.keys(sensitivity).filter((k) => sensitivity[k] === 'R');
      const sensitive = Object.keys(sensitivity).filter((k) => sensitivity[k] === 'S');

      if (resistant.length > 0) {
        interpretations.push(`Résistant à: ${resistant.join(', ')}`);
      }
      if (sensitive.length > 0) {
        interpretations.push(`Sensible à: ${sensitive.join(', ')}`);
      }
    }

    return interpretations.join('. ');
  }
}
