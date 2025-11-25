import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagingExam, ImagingStatus } from '../entities/imaging-exam.entity';
import { ImagingReport } from '../entities/imaging-report.entity';

@Injectable()
export class ImagingService {
  constructor(
    @InjectRepository(ImagingExam)
    private examRepository: Repository<ImagingExam>,
    @InjectRepository(ImagingReport)
    private reportRepository: Repository<ImagingReport>,
  ) {}

  async createExam(createDto: any): Promise<ImagingExam> {
    const numeroExamen = await this.generateExamNumber();

    const exam = this.examRepository.create({
      ...createDto,
      numeroExamen,
      requestDate: new Date(),
      status: ImagingStatus.REQUESTED,
    });

    const saved = await this.examRepository.save(exam);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllExams(filters?: any): Promise<ImagingExam[]> {
    const query = this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.patient', 'patient')
      .leftJoinAndSelect('exam.requestingDoctor', 'requestingDoctor')
      .leftJoinAndSelect('exam.technician', 'technician')
      .leftJoinAndSelect('exam.radiologist', 'radiologist')
      .leftJoinAndSelect('exam.reports', 'reports');

    if (filters?.status) {
      query.andWhere('exam.status = :status', { status: filters.status });
    }

    if (filters?.modality) {
      query.andWhere('exam.modality = :modality', { modality: filters.modality });
    }

    if (filters?.priority) {
      query.andWhere('exam.priority = :priority', { priority: filters.priority });
    }

    if (filters?.patientId) {
      query.andWhere('exam.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('exam.requestDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('exam.priority', 'DESC').addOrderBy('exam.requestDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<ImagingExam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['patient', 'requestingDoctor', 'technician', 'radiologist', 'reports'],
    });

    if (!exam) {
      throw new NotFoundException(`Imaging exam ${id} not found`);
    }

    return exam;
  }

  async findByNumero(numeroExamen: string): Promise<ImagingExam> {
    const exam = await this.examRepository.findOne({
      where: { numeroExamen },
      relations: ['patient', 'requestingDoctor', 'technician', 'radiologist', 'reports'],
    });

    if (!exam) {
      throw new NotFoundException(`Imaging exam ${numeroExamen} not found`);
    }

    return exam;
  }

  async update(id: string, updateDto: any): Promise<ImagingExam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateDto);
    const saved = await this.examRepository.save(exam);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async updateStatus(id: string, status: ImagingStatus, userId?: string, userName?: string): Promise<ImagingExam> {
    const exam = await this.findOne(id);
    exam.status = status;

    if (status === ImagingStatus.IN_PROGRESS && !exam.performedDate) {
      exam.performedDate = new Date();
      if (userId && userName) {
        exam.performedBy = userId;
        exam.performedByName = userName;
      }
    }

    const saved = await this.examRepository.save(exam);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async createReport(examId: string, reportData: any): Promise<ImagingReport> {
    const exam = await this.findOne(examId);

    const report = this.reportRepository.create({
      ...reportData,
      examId,
      reportDate: new Date(),
    });

    const savedReport = await this.reportRepository.save(report) as any as ImagingReport;

    exam.status = ImagingStatus.REPORTED;
    exam.reportedBy = reportData.radiologistId;
    exam.reportedByName = reportData.radiologistName;
    await this.examRepository.save(exam);

    return savedReport;
  }

  async findReportsByExam(examId: string): Promise<ImagingReport[]> {
    return await this.reportRepository.find({
      where: { examId },
      relations: ['radiologist', 'validator'],
      order: { reportDate: 'DESC' },
    });
  }

  async validateReport(id: string, validatorId: string, validatorName: string): Promise<ImagingReport> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['exam'],
    });

    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }

    report.validatedBy = validatorId;
    report.validatedByName = validatorName;
    report.validationDate = new Date();

    const savedReport = await this.reportRepository.save(report) as any as ImagingReport;

    report.exam.status = ImagingStatus.VALIDATED;
    await this.examRepository.save(report.exam);

    return savedReport;
  }

  async getStatistics(dateDebut?: Date, dateFin?: Date): Promise<any> {
    const query = this.examRepository.createQueryBuilder('exam');

    if (dateDebut && dateFin) {
      query.where('exam.requestDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut,
        dateFin,
      });
    }

    const total = await query.getCount();

    const byModality = await this.examRepository
      .createQueryBuilder('exam')
      .select('exam.modality', 'modality')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'exam.requestDate BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('exam.modality')
      .getRawMany();

    const byStatus = await this.examRepository
      .createQueryBuilder('exam')
      .select('exam.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'exam.requestDate BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('exam.status')
      .getRawMany();

    return {
      total,
      byModality: byModality.reduce((acc, item) => {
        acc[item.modality] = parseInt(item.count, 10);
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      }, {}),
    };
  }

  private async generateExamNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `IMG-${year}-`;

    const lastExam = await this.examRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastExam && lastExam.numeroExamen.startsWith(prefix)) {
      const lastNumber = parseInt(lastExam.numeroExamen.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
