import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EmergencyCase, EmergencyPriority, EmergencyStatus } from '../entities/emergency-case.entity';

interface QueueItem {
  emergency: EmergencyCase;
  waitTime: number;
  estimatedWaitTime: number;
}

@Injectable()
export class EmergencyQueueService {
  constructor(
    @InjectRepository(EmergencyCase)
    private emergencyRepository: Repository<EmergencyCase>,
  ) {}

  async getQueue(): Promise<QueueItem[]> {
    const activeEmergencies = await this.emergencyRepository.find({
      where: {
        status: In([EmergencyStatus.EN_ATTENTE, EmergencyStatus.TRIAGE_EN_COURS]),
      },
      relations: ['patient', 'triageUser'],
      order: {
        priority: 'ASC',
        arrivalTime: 'ASC',
      },
    });

    const now = new Date();
    const queueItems: QueueItem[] = activeEmergencies.map((emergency) => {
      const waitTime = Math.floor((now.getTime() - emergency.arrivalTime.getTime()) / 60000);
      const estimatedWaitTime = this.calculateEstimatedWaitTime(emergency.priority, waitTime);

      return {
        emergency,
        waitTime,
        estimatedWaitTime,
      };
    });

    return queueItems;
  }

  async getQueueByPriority(priority: EmergencyPriority): Promise<QueueItem[]> {
    const emergencies = await this.emergencyRepository.find({
      where: {
        priority,
        status: In([EmergencyStatus.EN_ATTENTE, EmergencyStatus.TRIAGE_EN_COURS]),
      },
      relations: ['patient', 'triageUser'],
      order: {
        arrivalTime: 'ASC',
      },
    });

    const now = new Date();
    return emergencies.map((emergency) => {
      const waitTime = Math.floor((now.getTime() - emergency.arrivalTime.getTime()) / 60000);
      const estimatedWaitTime = this.calculateEstimatedWaitTime(emergency.priority, waitTime);

      return {
        emergency,
        waitTime,
        estimatedWaitTime,
      };
    });
  }

  async getQueuePosition(emergencyId: string): Promise<number> {
    const emergency = await this.emergencyRepository.findOne({
      where: { id: emergencyId },
    });

    if (!emergency) {
      return -1;
    }

    const queue = await this.getQueue();
    const position = queue.findIndex((item) => item.emergency.id === emergencyId);

    return position + 1;
  }

  async getNextPatient(): Promise<EmergencyCase | null> {
    const queue = await this.getQueue();
    return queue.length > 0 ? queue[0].emergency : null;
  }

  async getOverdueCases(): Promise<EmergencyCase[]> {
    const now = new Date();
    const allActive = await this.emergencyRepository.find({
      where: {
        status: In([EmergencyStatus.EN_ATTENTE, EmergencyStatus.TRIAGE_EN_COURS]),
      },
      relations: ['patient', 'triageUser'],
    });

    return allActive.filter((emergency) => {
      const waitTime = Math.floor((now.getTime() - emergency.arrivalTime.getTime()) / 60000);
      const threshold = this.getMaxWaitTime(emergency.priority);
      return waitTime > threshold;
    });
  }

  async getQueueStatistics(): Promise<any> {
    const queue = await this.getQueue();

    const byPriority = {
      [EmergencyPriority.P1]: 0,
      [EmergencyPriority.P2]: 0,
      [EmergencyPriority.P3]: 0,
      [EmergencyPriority.P4]: 0,
      [EmergencyPriority.P5]: 0,
    };

    let totalWaitTime = 0;

    queue.forEach((item) => {
      byPriority[item.emergency.priority]++;
      totalWaitTime += item.waitTime;
    });

    const averageWaitTime = queue.length > 0 ? Math.round(totalWaitTime / queue.length) : 0;

    const overdueCases = await this.getOverdueCases();

    return {
      totalInQueue: queue.length,
      byPriority,
      averageWaitTime,
      overdueCases: overdueCases.length,
      oldestCase: queue.length > 0 ? queue[queue.length - 1] : null,
    };
  }

  private calculateEstimatedWaitTime(priority: EmergencyPriority, currentWaitTime: number): number {
    const maxWaitTime = this.getMaxWaitTime(priority);
    const remaining = maxWaitTime - currentWaitTime;
    return Math.max(0, remaining);
  }

  private getMaxWaitTime(priority: EmergencyPriority): number {
    // Temps d'attente maximum en minutes selon la priorité
    switch (priority) {
      case EmergencyPriority.P1:
        return 0; // Immédiat
      case EmergencyPriority.P2:
        return 15;
      case EmergencyPriority.P3:
        return 30;
      case EmergencyPriority.P4:
        return 60;
      case EmergencyPriority.P5:
        return 120;
      default:
        return 60;
    }
  }
}
