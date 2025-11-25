import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyCase, EmergencyPriority, EmergencyStatus } from '../entities/emergency-case.entity';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(EmergencyCase)
    private emergencyRepository: Repository<EmergencyCase>,
  ) {}

  async create(createDto: any): Promise<EmergencyCase> {
    const numeroUrgence = await this.generateEmergencyNumber();

    const emergency = this.emergencyRepository.create({
      ...createDto,
      numeroUrgence,
      arrivalTime: new Date(),
      status: EmergencyStatus.EN_ATTENTE,
    });

    const saved = await this.emergencyRepository.save(emergency);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(filters?: any): Promise<EmergencyCase[]> {
    const query = this.emergencyRepository
      .createQueryBuilder('emergency')
      .leftJoinAndSelect('emergency.patient', 'patient')
      .leftJoinAndSelect('emergency.triageUser', 'triageUser')
      .leftJoinAndSelect('emergency.assignedDoctor', 'assignedDoctor');

    if (filters?.status) {
      query.andWhere('emergency.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query.andWhere('emergency.priority = :priority', { priority: filters.priority });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('emergency.arrivalTime BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('emergency.priority', 'ASC').addOrderBy('emergency.arrivalTime', 'ASC').getMany();
  }

  async findOne(id: string): Promise<EmergencyCase> {
    const emergency = await this.emergencyRepository.findOne({
      where: { id },
      relations: ['patient', 'triageUser', 'assignedDoctor'],
    });

    if (!emergency) {
      throw new NotFoundException(`Emergency case ${id} not found`);
    }

    return emergency;
  }

  async findByNumero(numeroUrgence: string): Promise<EmergencyCase> {
    const emergency = await this.emergencyRepository.findOne({
      where: { numeroUrgence },
      relations: ['patient', 'triageUser', 'assignedDoctor'],
    });

    if (!emergency) {
      throw new NotFoundException(`Emergency case ${numeroUrgence} not found`);
    }

    return emergency;
  }

  async findActive(): Promise<EmergencyCase[]> {
    return await this.emergencyRepository.find({
      where: [
        { status: EmergencyStatus.EN_ATTENTE },
        { status: EmergencyStatus.TRIAGE_EN_COURS },
        { status: EmergencyStatus.EN_COURS },
      ],
      relations: ['patient', 'triageUser', 'assignedDoctor'],
      order: {
        priority: 'ASC',
        arrivalTime: 'ASC',
      },
    });
  }

  async findByPriority(priority: EmergencyPriority): Promise<EmergencyCase[]> {
    return await this.emergencyRepository.find({
      where: { priority },
      relations: ['patient', 'triageUser', 'assignedDoctor'],
      order: {
        arrivalTime: 'ASC',
      },
    });
  }

  async update(id: string, updateDto: any): Promise<EmergencyCase> {
    const emergency = await this.findOne(id);
    Object.assign(emergency, updateDto);
    const saved = await this.emergencyRepository.save(emergency);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async updateStatus(id: string, status: EmergencyStatus): Promise<EmergencyCase> {
    const emergency = await this.findOne(id);
    emergency.status = status;

    if (status === EmergencyStatus.EN_COURS && !emergency.careTakenTime) {
      emergency.careTakenTime = new Date();
    }

    if (
      (status === EmergencyStatus.SORTI || status === EmergencyStatus.HOSPITALISE || status === EmergencyStatus.TERMINE) &&
      !emergency.dischargeTime
    ) {
      emergency.dischargeTime = new Date();
    }

    const saved = await this.emergencyRepository.save(emergency);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async assignDoctor(id: string, doctorId: string, doctorName: string): Promise<EmergencyCase> {
    const emergency = await this.findOne(id);
    emergency.assignedTo = doctorId;
    emergency.assignedToName = doctorName;
    emergency.status = EmergencyStatus.EN_COURS;
    emergency.careTakenTime = new Date();
    const saved = await this.emergencyRepository.save(emergency);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getStatistics(dateDebut?: Date, dateFin?: Date): Promise<any> {
    const query = this.emergencyRepository.createQueryBuilder('emergency');

    if (dateDebut && dateFin) {
      query.where('emergency.arrivalTime BETWEEN :dateDebut AND :dateFin', {
        dateDebut,
        dateFin,
      });
    }

    const total = await query.getCount();

    const byPriority = await this.emergencyRepository
      .createQueryBuilder('emergency')
      .select('emergency.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'emergency.arrivalTime BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('emergency.priority')
      .getRawMany();

    const byStatus = await this.emergencyRepository
      .createQueryBuilder('emergency')
      .select('emergency.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'emergency.arrivalTime BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('emergency.status')
      .getRawMany();

    const averageWaitTime = await this.calculateAverageWaitTime(dateDebut, dateFin);

    return {
      total,
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = parseInt(item.count, 10);
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      }, {}),
      averageWaitTime,
    };
  }

  private async calculateAverageWaitTime(dateDebut?: Date, dateFin?: Date): Promise<number> {
    const query = this.emergencyRepository
      .createQueryBuilder('emergency')
      .where('emergency.careTakenTime IS NOT NULL');

    if (dateDebut && dateFin) {
      query.andWhere('emergency.arrivalTime BETWEEN :dateDebut AND :dateFin', {
        dateDebut,
        dateFin,
      });
    }

    const cases = await query.getMany();

    if (cases.length === 0) return 0;

    const totalWaitTime = cases.reduce((sum, c) => {
      const wait = c.careTakenTime.getTime() - c.arrivalTime.getTime();
      return sum + wait;
    }, 0);

    return Math.round(totalWaitTime / cases.length / 60000); // En minutes
  }

  private async generateEmergencyNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `URG-${year}-`;

    const lastEmergency = await this.emergencyRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastEmergency && lastEmergency.numeroUrgence.startsWith(prefix)) {
      const lastNumber = parseInt(lastEmergency.numeroUrgence.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }
}
