import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Triage } from '../entities/triage.entity';
import { EmergencyCase, EmergencyPriority, EmergencyStatus } from '../entities/emergency-case.entity';

@Injectable()
export class TriageService {
  constructor(
    @InjectRepository(Triage)
    private triageRepository: Repository<Triage>,
    @InjectRepository(EmergencyCase)
    private emergencyRepository: Repository<EmergencyCase>,
  ) {}

  async performTriage(emergencyId: string, triageData: any): Promise<Triage> {
    const emergency = await this.emergencyRepository.findOne({
      where: { id: emergencyId },
    });

    if (!emergency) {
      throw new NotFoundException(`Emergency case ${emergencyId} not found`);
    }

    const triage = this.triageRepository.create({
      emergencyId,
      ...triageData,
      triageTime: new Date(),
    });

    const savedTriage = await this.triageRepository.save(triage) as any as Triage;

    // Mettre à jour l'urgence
    emergency.priority = triageData.priorityAssigned;
    emergency.triageBy = triageData.triageBy;
    emergency.triageByName = triageData.triageByName;
    emergency.triageTime = new Date();
    emergency.status = EmergencyStatus.EN_ATTENTE;
    emergency.temperature = triageData.temperature;
    emergency.heartRate = triageData.heartRate;
    emergency.bloodPressureSystolic = triageData.bloodPressureSystolic;
    emergency.bloodPressureDiastolic = triageData.bloodPressureDiastolic;
    emergency.respiratoryRate = triageData.respiratoryRate;
    emergency.oxygenSaturation = triageData.oxygenSaturation;
    emergency.painScale = triageData.painScale;
    emergency.consciousness = triageData.consciousness;

    await this.emergencyRepository.save(emergency);

    return savedTriage;
  }

  async findByEmergency(emergencyId: string): Promise<Triage[]> {
    return await this.triageRepository.find({
      where: { emergencyId },
      relations: ['triageUser'],
      order: { triageTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Triage> {
    const triage = await this.triageRepository.findOne({
      where: { id },
      relations: ['emergency', 'triageUser'],
    });

    if (!triage) {
      throw new NotFoundException(`Triage ${id} not found`);
    }

    return triage;
  }

  async calculatePriority(vitalSigns: any, symptoms: string): Promise<EmergencyPriority> {
    // Algorithme de calcul de priorité basé sur les signes vitaux
    let score = 0;

    // Température
    if (vitalSigns.temperature) {
      if (vitalSigns.temperature < 35 || vitalSigns.temperature > 40) score += 3;
      else if (vitalSigns.temperature > 38.5) score += 1;
    }

    // Fréquence cardiaque
    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate < 50 || vitalSigns.heartRate > 120) score += 3;
      else if (vitalSigns.heartRate > 100) score += 1;
    }

    // Pression artérielle
    if (vitalSigns.bloodPressureSystolic) {
      if (vitalSigns.bloodPressureSystolic < 90 || vitalSigns.bloodPressureSystolic > 180) score += 3;
      else if (vitalSigns.bloodPressureSystolic > 140) score += 1;
    }

    // Fréquence respiratoire
    if (vitalSigns.respiratoryRate) {
      if (vitalSigns.respiratoryRate < 12 || vitalSigns.respiratoryRate > 25) score += 3;
      else if (vitalSigns.respiratoryRate > 20) score += 1;
    }

    // Saturation en oxygène
    if (vitalSigns.oxygenSaturation) {
      if (vitalSigns.oxygenSaturation < 90) score += 3;
      else if (vitalSigns.oxygenSaturation < 95) score += 2;
    }

    // Échelle de douleur
    if (vitalSigns.painScale) {
      if (vitalSigns.painScale >= 8) score += 2;
      else if (vitalSigns.painScale >= 5) score += 1;
    }

    // Niveau de conscience
    if (vitalSigns.consciousness && vitalSigns.consciousness !== 'Alert') {
      score += 3;
    }

    // Symptômes critiques
    const criticalSymptoms = [
      'douleur thoracique',
      'difficulté respiratoire',
      'hémorragie',
      'perte de conscience',
      'convulsions',
      'accident vasculaire',
      'trauma crânien',
    ];

    if (symptoms) {
      const lowerSymptoms = symptoms.toLowerCase();
      if (criticalSymptoms.some((s) => lowerSymptoms.includes(s))) {
        score += 5;
      }
    }

    // Déterminer la priorité
    if (score >= 9) return EmergencyPriority.P1;
    if (score >= 6) return EmergencyPriority.P2;
    if (score >= 3) return EmergencyPriority.P3;
    if (score >= 1) return EmergencyPriority.P4;
    return EmergencyPriority.P5;
  }
}
