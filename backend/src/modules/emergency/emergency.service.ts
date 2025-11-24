import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Emergency, EmergencyStatus } from './entities/emergency.entity';
import { CreateEmergencyDto, UpdateEmergencyDto, QueryEmergencyDto } from './dto';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(Emergency)
    private readonly emergencyRepository: Repository<Emergency>,
  ) {}

  /**
   * Créer un nouveau triage
   */
  async create(
    createEmergencyDto: CreateEmergencyDto,
    triagedById: string,
  ): Promise<Emergency> {
    const emergency = this.emergencyRepository.create({
      ...createEmergencyDto,
      triagedById,
      status: EmergencyStatus.WAITING,
    });

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Récupérer toutes les urgences avec filtres et pagination
   */
  async findAll(query: QueryEmergencyDto): Promise<{
    data: Emergency[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { priority, status, patientId, assignedToId, startDate, endDate, page = 1, limit = 20 } = query;

    const where: any = {};

    if (priority) {
      where.priority = priority;
    }

    if (status) {
      where.status = status;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (startDate && endDate) {
      where.arrivalTime = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.arrivalTime = MoreThan(new Date(startDate));
    } else if (endDate) {
      where.arrivalTime = LessThan(new Date(endDate));
    }

    const [data, total] = await this.emergencyRepository.findAndCount({
      where,
      relations: ['triagedBy', 'assignedTo'],
      order: {
        priority: 'ASC',
        arrivalTime: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculer le temps d'attente pour chaque urgence
    data.forEach((emergency) => {
      if (emergency.status === EmergencyStatus.WAITING) {
        const now = new Date();
        const arrival = new Date(emergency.arrivalTime);
        emergency.waitTime = Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
      }
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Récupérer la file d'attente (uniquement les urgences en attente)
   */
  async getQueue(): Promise<Emergency[]> {
    const emergencies = await this.emergencyRepository.find({
      where: { status: EmergencyStatus.WAITING },
      relations: ['triagedBy'],
      order: {
        priority: 'ASC',
        arrivalTime: 'ASC',
      },
    });

    // Calculer le temps d'attente
    const now = new Date();
    emergencies.forEach((emergency) => {
      const arrival = new Date(emergency.arrivalTime);
      emergency.waitTime = Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
    });

    return emergencies;
  }

  /**
   * Récupérer les statistiques du dashboard
   */
  async getStatistics(): Promise<{
    total: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    averageWaitTime: number;
  }> {
    const emergencies = await this.emergencyRepository.find();

    const byPriority = emergencies.reduce((acc, emergency) => {
      acc[emergency.priority] = (acc[emergency.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = emergencies.reduce((acc, emergency) => {
      acc[emergency.status] = (acc[emergency.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculer le temps d'attente moyen pour les urgences en attente
    const waitingEmergencies = emergencies.filter((e) => e.status === EmergencyStatus.WAITING);
    const now = new Date();
    const totalWaitTime = waitingEmergencies.reduce((acc, emergency) => {
      const arrival = new Date(emergency.arrivalTime);
      return acc + (now.getTime() - arrival.getTime()) / (1000 * 60);
    }, 0);

    const averageWaitTime = waitingEmergencies.length > 0
      ? Math.floor(totalWaitTime / waitingEmergencies.length)
      : 0;

    return {
      total: emergencies.length,
      byPriority,
      byStatus,
      averageWaitTime,
    };
  }

  /**
   * Récupérer une urgence par ID
   */
  async findOne(id: string): Promise<Emergency> {
    const emergency = await this.emergencyRepository.findOne({
      where: { id },
      relations: ['triagedBy', 'assignedTo'],
    });

    if (!emergency) {
      throw new NotFoundException(`Urgence #${id} non trouvée`);
    }

    // Calculer le temps d'attente
    if (emergency.status === EmergencyStatus.WAITING) {
      const now = new Date();
      const arrival = new Date(emergency.arrivalTime);
      emergency.waitTime = Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
    }

    return emergency;
  }

  /**
   * Mettre à jour une urgence
   */
  async update(id: string, updateEmergencyDto: UpdateEmergencyDto): Promise<Emergency> {
    const emergency = await this.findOne(id);

    Object.assign(emergency, updateEmergencyDto);

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Prendre en charge une urgence
   */
  async takeCare(id: string, userId: string): Promise<Emergency> {
    const emergency = await this.findOne(id);

    if (emergency.status !== EmergencyStatus.WAITING) {
      throw new BadRequestException('Cette urgence n\'est plus en attente');
    }

    emergency.status = EmergencyStatus.IN_PROGRESS;
    emergency.assignedToId = userId;
    emergency.takenCareAt = new Date();

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Réassigner la priorité
   */
  async reassignPriority(id: string, priority: string): Promise<Emergency> {
    const emergency = await this.findOne(id);

    emergency.priority = priority as any;

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Transférer une urgence
   */
  async transfer(
    id: string,
    transferredTo: string,
    transferReason: string,
  ): Promise<Emergency> {
    const emergency = await this.findOne(id);

    emergency.status = EmergencyStatus.TRANSFERRED;
    emergency.transferredTo = transferredTo;
    emergency.transferReason = transferReason;
    emergency.completedAt = new Date();

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Annuler une urgence
   */
  async cancel(id: string, cancellationReason: string): Promise<Emergency> {
    const emergency = await this.findOne(id);

    if (emergency.status === EmergencyStatus.COMPLETED) {
      throw new BadRequestException('Impossible d\'annuler une urgence déjà complétée');
    }

    emergency.status = EmergencyStatus.CANCELLED;
    emergency.cancellationReason = cancellationReason;
    emergency.completedAt = new Date();

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Compléter une urgence
   */
  async complete(id: string): Promise<Emergency> {
    const emergency = await this.findOne(id);

    if (emergency.status !== EmergencyStatus.IN_PROGRESS) {
      throw new BadRequestException('L\'urgence doit être en cours pour être complétée');
    }

    emergency.status = EmergencyStatus.COMPLETED;
    emergency.completedAt = new Date();

    return this.emergencyRepository.save(emergency);
  }

  /**
   * Supprimer une urgence
   */
  async remove(id: string): Promise<void> {
    const emergency = await this.findOne(id);
    await this.emergencyRepository.remove(emergency);
  }
}
