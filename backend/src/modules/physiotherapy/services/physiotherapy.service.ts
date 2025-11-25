import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhysioSession, SessionStatus } from '../entities/physio-session.entity';
import { RehabilitationPlan } from '../entities/rehabilitation-plan.entity';

@Injectable()
export class PhysiotherapyService {
  constructor(
    @InjectRepository(PhysioSession)
    private sessionRepository: Repository<PhysioSession>,
    @InjectRepository(RehabilitationPlan)
    private planRepository: Repository<RehabilitationPlan>,
  ) {}

  async createSession(createDto: any): Promise<PhysioSession> {
    const numeroSession = await this.generateSessionNumber();

    const session = this.sessionRepository.create({
      ...createDto,
      numeroSession,
      status: SessionStatus.SCHEDULED,
    });

    const saved = await this.sessionRepository.save(session);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllSessions(filters?: any): Promise<PhysioSession[]> {
    const query = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.patient', 'patient')
      .leftJoinAndSelect('session.therapist', 'therapist')
      .leftJoinAndSelect('session.plan', 'plan');

    if (filters?.status) {
      query.andWhere('session.status = :status', { status: filters.status });
    }

    if (filters?.patientId) {
      query.andWhere('session.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.therapistId) {
      query.andWhere('session.therapistId = :therapistId', { therapistId: filters.therapistId });
    }

    return await query.orderBy('session.sessionDate', 'DESC').getMany();
  }

  async findOneSession(id: string): Promise<PhysioSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['patient', 'therapist', 'plan'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return session;
  }

  async updateSession(id: string, updateDto: any): Promise<PhysioSession> {
    const session = await this.findOneSession(id);
    Object.assign(session, updateDto);
    const saved = await this.sessionRepository.save(session);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async updateStatus(id: string, status: SessionStatus): Promise<PhysioSession> {
    const session = await this.findOneSession(id);
    session.status = status;

    if (status === SessionStatus.COMPLETED && session.planId) {
      await this.incrementPlanProgress(session.planId);
    }

    const saved = await this.sessionRepository.save(session);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async createPlan(createDto: any): Promise<RehabilitationPlan> {
    const numeroPlan = await this.generatePlanNumber();

    const plan = this.planRepository.create({
      ...createDto,
      numeroPlan,
      completedSessions: 0,
      isActive: true,
    });

    const saved = await this.planRepository.save(plan);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllPlans(filters?: any): Promise<RehabilitationPlan[]> {
    const query = this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.patient', 'patient')
      .leftJoinAndSelect('plan.therapist', 'therapist');

    if (filters?.isActive !== undefined) {
      query.andWhere('plan.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.patientId) {
      query.andWhere('plan.patientId = :patientId', { patientId: filters.patientId });
    }

    return await query.orderBy('plan.startDate', 'DESC').getMany();
  }

  async findOnePlan(id: string): Promise<RehabilitationPlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['patient', 'therapist'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${id} not found`);
    }

    return plan;
  }

  private async incrementPlanProgress(planId: string): Promise<void> {
    const plan = await this.findOnePlan(planId);
    plan.completedSessions++;

    if (plan.completedSessions >= plan.totalSessions) {
      plan.isActive = false;
    }

    await this.planRepository.save(plan);
  }

  private async generateSessionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PS-${year}-`;

    const lastSession = await this.sessionRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastSession && lastSession.numeroSession.startsWith(prefix)) {
      const lastNumber = parseInt(lastSession.numeroSession.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }

  private async generatePlanNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RP-${year}-`;

    const lastPlan = await this.planRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastPlan && lastPlan.numeroPlan.startsWith(prefix)) {
      const lastNumber = parseInt(lastPlan.numeroPlan.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }
}
