import { Injectable } from '@nestjs/common';

@Injectable()
export class RehabilitationService {
  assessFunctionalProgress(beforeScore: number, afterScore: number): string {
    const improvement = afterScore - beforeScore;
    const improvementPercent = (improvement / beforeScore) * 100;

    if (improvementPercent >= 50) {
      return 'Excellent progrès';
    } else if (improvementPercent >= 25) {
      return 'Bon progrès';
    } else if (improvementPercent >= 10) {
      return 'Progrès modéré';
    } else if (improvementPercent > 0) {
      return 'Progrès léger';
    } else {
      return 'Aucun progrès ou régression';
    }
  }

  generateExercisePlan(condition: string): any[] {
    const exercises = {
      'back_pain': [
        { name: 'Étirements lombaires', duration: 10, repetitions: 3 },
        { name: 'Renforcement du core', duration: 15, repetitions: 10 },
        { name: 'Mobilisation vertébrale', duration: 10, repetitions: 5 },
      ],
      'knee_pain': [
        { name: 'Renforcement quadriceps', duration: 15, repetitions: 15 },
        { name: 'Mobilisation genou', duration: 10, repetitions: 10 },
        { name: 'Équilibre sur une jambe', duration: 5, repetitions: 3 },
      ],
      'shoulder_pain': [
        { name: 'Pendule de Codman', duration: 5, repetitions: 10 },
        { name: 'Rotation externe', duration: 10, repetitions: 12 },
        { name: 'Élévation assistée', duration: 10, repetitions: 10 },
      ],
    };

    return exercises[condition] || [];
  }
}
