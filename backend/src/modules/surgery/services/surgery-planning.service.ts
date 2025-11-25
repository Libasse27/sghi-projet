import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Surgery, SurgeryStatus } from '../entities/surgery.entity';
import { OperatingRoomService } from './operating-room.service';

@Injectable()
export class SurgeryPlanningService {
  constructor(
    @InjectRepository(Surgery)
    private surgeryRepository: Repository<Surgery>,
    private operatingRoomService: OperatingRoomService,
  ) {}

  async create(createDto: any): Promise<Surgery> {
    const numeroChirurgie = await this.generateSurgeryNumber();

    // Check for conflicts
    await this.checkScheduleConflicts(
      createDto.operatingRoomId,
      createDto.scheduledDate,
      createDto.estimatedDuration,
    );

    // Check surgeon availability
    await this.checkSurgeonAvailability(
      createDto.surgeonId,
      createDto.scheduledDate,
      createDto.estimatedDuration,
    );

    const surgery = this.surgeryRepository.create({
      ...createDto,
      numeroChirurgie,
      status: SurgeryStatus.SCHEDULED,
    });

    const saved = await this.surgeryRepository.save(surgery) as any as Surgery;

    // Reserve the operating room
    if (createDto.operatingRoomId) {
      await this.operatingRoomService.reserveRoom(createDto.operatingRoomId);
    }

    return saved;
  }

  async findAll(filters?: any): Promise<Surgery[]> {
    const query = this.surgeryRepository
      .createQueryBuilder('surgery')
      .leftJoinAndSelect('surgery.patient', 'patient')
      .leftJoinAndSelect('surgery.surgeon', 'surgeon')
      .leftJoinAndSelect('surgery.anesthesiologist', 'anesthesiologist')
      .leftJoinAndSelect('surgery.operatingRoom', 'operatingRoom');

    if (filters?.patientId) {
      query.andWhere('surgery.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.surgeonId) {
      query.andWhere('surgery.surgeonId = :surgeonId', { surgeonId: filters.surgeonId });
    }

    if (filters?.status) {
      query.andWhere('surgery.status = :status', { status: filters.status });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('surgery.scheduledDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    if (filters?.isEmergency !== undefined) {
      query.andWhere('surgery.isEmergency = :isEmergency', { isEmergency: filters.isEmergency });
    }

    return await query.orderBy('surgery.scheduledDate', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Surgery> {
    const surgery = await this.surgeryRepository.findOne({
      where: { id },
      relations: ['patient', 'surgeon', 'anesthesiologist', 'operatingRoom'],
    });

    if (!surgery) {
      throw new NotFoundException(`Surgery ${id} not found`);
    }

    return surgery;
  }

  async update(id: string, updateDto: any): Promise<Surgery> {
    const surgery = await this.findOne(id);

    // If rescheduling, check conflicts
    if (updateDto.scheduledDate || updateDto.operatingRoomId || updateDto.estimatedDuration) {
      const scheduledDate = updateDto.scheduledDate || surgery.scheduledDate;
      const operatingRoomId = updateDto.operatingRoomId || surgery.operatingRoomId;
      const estimatedDuration = updateDto.estimatedDuration || surgery.estimatedDuration;

      await this.checkScheduleConflicts(operatingRoomId, scheduledDate, estimatedDuration, id);
    }

    Object.assign(surgery, updateDto);
    const saved = await this.surgeryRepository.save(surgery) as any as Surgery;
    return saved;
  }

  async startSurgery(id: string): Promise<Surgery> {
    const surgery = await this.findOne(id);

    if (surgery.status !== SurgeryStatus.SCHEDULED) {
      throw new BadRequestException('Surgery must be in SCHEDULED status to start');
    }

    surgery.status = SurgeryStatus.IN_PROGRESS;
    surgery.actualStartTime = new Date();

    if (surgery.operatingRoomId) {
      await this.operatingRoomService.occupyRoom(surgery.operatingRoomId);
    }

    return await this.surgeryRepository.save(surgery) as any as Surgery;
  }

  async completeSurgery(id: string, completionDto: any): Promise<Surgery> {
    const surgery = await this.findOne(id);

    if (surgery.status !== SurgeryStatus.IN_PROGRESS) {
      throw new BadRequestException('Surgery must be in IN_PROGRESS status to complete');
    }

    surgery.status = SurgeryStatus.COMPLETED;
    surgery.actualEndTime = new Date();
    surgery.intraOpNotes = completionDto.intraOpNotes;
    surgery.postOpNotes = completionDto.postOpNotes;
    surgery.complications = completionDto.complications;

    if (surgery.operatingRoomId) {
      await this.operatingRoomService.releaseRoom(surgery.operatingRoomId);
    }

    return await this.surgeryRepository.save(surgery) as any as Surgery;
  }

  async cancelSurgery(id: string, reason: string): Promise<Surgery> {
    const surgery = await this.findOne(id);

    if (surgery.status === SurgeryStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed surgery');
    }

    surgery.status = SurgeryStatus.CANCELLED;
    surgery.postOpNotes = `Cancelled: ${reason}`;

    if (surgery.operatingRoomId) {
      await this.operatingRoomService.releaseRoom(surgery.operatingRoomId);
    }

    return await this.surgeryRepository.save(surgery) as any as Surgery;
  }

  async getTodaySchedule(): Promise<Surgery[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.surgeryRepository.find({
      where: {
        scheduledDate: Between(today, tomorrow),
        status: Not(SurgeryStatus.CANCELLED),
      },
      relations: ['patient', 'surgeon', 'operatingRoom'],
      order: { scheduledDate: 'ASC' },
    });
  }

  private async checkScheduleConflicts(
    operatingRoomId: string,
    scheduledDate: Date,
    estimatedDuration: number,
    excludeSurgeryId?: string,
  ): Promise<void> {
    const startTime = new Date(scheduledDate);
    const endTime = new Date(startTime.getTime() + estimatedDuration * 60000);

    const query = this.surgeryRepository
      .createQueryBuilder('surgery')
      .where('surgery.operatingRoomId = :operatingRoomId', { operatingRoomId })
      .andWhere('surgery.status IN (:...statuses)', {
        statuses: [SurgeryStatus.SCHEDULED, SurgeryStatus.IN_PROGRESS],
      })
      .andWhere(
        '(surgery.scheduledDate < :endTime AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) > :startTime)',
        { startTime, endTime },
      );

    if (excludeSurgeryId) {
      query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
    }

    const conflicts = await query.getMany();

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Operating room conflict detected. Room is already scheduled for another surgery at this time.`,
      );
    }
  }

  private async checkSurgeonAvailability(
    surgeonId: string,
    scheduledDate: Date,
    estimatedDuration: number,
    excludeSurgeryId?: string,
  ): Promise<void> {
    const startTime = new Date(scheduledDate);
    const endTime = new Date(startTime.getTime() + estimatedDuration * 60000);

    const query = this.surgeryRepository
      .createQueryBuilder('surgery')
      .where('surgery.surgeonId = :surgeonId', { surgeonId })
      .andWhere('surgery.status IN (:...statuses)', {
        statuses: [SurgeryStatus.SCHEDULED, SurgeryStatus.IN_PROGRESS],
      })
      .andWhere(
        '(surgery.scheduledDate < :endTime AND DATE_ADD(surgery.scheduledDate, INTERVAL surgery.estimatedDuration MINUTE) > :startTime)',
        { startTime, endTime },
      );

    if (excludeSurgeryId) {
      query.andWhere('surgery.id != :excludeSurgeryId', { excludeSurgeryId });
    }

    const conflicts = await query.getMany();

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `Surgeon is not available. Another surgery is scheduled at this time.`,
      );
    }
  }

  private async generateSurgeryNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CHIR-${year}-`;

    const lastSurgery = await this.surgeryRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastSurgery && lastSurgery.numeroChirurgie.startsWith(prefix)) {
      const lastNumber = parseInt(lastSurgery.numeroChirurgie.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
