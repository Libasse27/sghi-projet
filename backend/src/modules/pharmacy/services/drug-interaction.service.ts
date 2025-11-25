import { Injectable } from '@nestjs/common';

interface DrugInteraction {
  severity: 'MINOR' | 'MODERATE' | 'MAJOR';
  description: string;
}

@Injectable()
export class DrugInteractionService {
  private interactions: Map<string, Map<string, DrugInteraction>> = new Map();

  constructor() {
    this.initializeInteractions();
  }

  private initializeInteractions() {
    this.addInteraction('WARFARIN', 'ASPIRIN', {
      severity: 'MAJOR',
      description: 'Risque accru de saignement. Surveillance étroite nécessaire.',
    });

    this.addInteraction('ACE_INHIBITORS', 'POTASSIUM', {
      severity: 'MODERATE',
      description: 'Risque d\'hyperkaliémie. Surveiller le potassium sérique.',
    });

    this.addInteraction('METFORMIN', 'ALCOHOL', {
      severity: 'MODERATE',
      description: 'Risque accru d\'acidose lactique. Éviter l\'alcool.',
    });
  }

  private addInteraction(drug1: string, drug2: string, interaction: DrugInteraction) {
    if (!this.interactions.has(drug1)) {
      this.interactions.set(drug1, new Map());
    }
    if (!this.interactions.has(drug2)) {
      this.interactions.set(drug2, new Map());
    }

    this.interactions.get(drug1).set(drug2, interaction);
    this.interactions.get(drug2).set(drug1, interaction);
  }

  checkInteractions(medicineNames: string[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];

    for (let i = 0; i < medicineNames.length; i++) {
      for (let j = i + 1; j < medicineNames.length; j++) {
        const drug1 = medicineNames[i].toUpperCase();
        const drug2 = medicineNames[j].toUpperCase();

        if (this.interactions.has(drug1) && this.interactions.get(drug1).has(drug2)) {
          interactions.push(this.interactions.get(drug1).get(drug2));
        }
      }
    }

    return interactions;
  }

  checkSingleInteraction(medicine1: string, medicine2: string): DrugInteraction | null {
    const drug1 = medicine1.toUpperCase();
    const drug2 = medicine2.toUpperCase();

    if (this.interactions.has(drug1) && this.interactions.get(drug1).has(drug2)) {
      return this.interactions.get(drug1).get(drug2);
    }

    return null;
  }
}
