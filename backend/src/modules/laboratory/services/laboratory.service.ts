import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Analysis, AnalysisStatus, AnalysisPriority, AnalysisType } from '../entities/analysis.entity';
import { Sample, SampleStatus } from '../entities/sample.entity';
import { Result, ResultStatus } from '../entities/result.entity';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>,
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  async createAnalysis(createDto: any): Promise<Analysis> {
    const numeroAnalyse = await this.generateAnalysisNumber();

    const analysis = this.analysisRepository.create({
      ...createDto,
      numeroAnalyse,
      requestDate: new Date(),
      status: AnalysisStatus.REQUESTED,
    });

    const saved = await this.analysisRepository.save(analysis);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllAnalyses(filters?: any): Promise<Analysis[]> {
    const query = this.analysisRepository
      .createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.patient', 'patient')
      .leftJoinAndSelect('analysis.requestingDoctor', 'requestingDoctor')
      .leftJoinAndSelect('analysis.technician', 'technician')
      .leftJoinAndSelect('analysis.validator', 'validator')
      .leftJoinAndSelect('analysis.samples', 'samples')
      .leftJoinAndSelect('analysis.results', 'results');

    if (filters?.status) {
      query.andWhere('analysis.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('analysis.type = :type', { type: filters.type });
    }

    if (filters?.priority) {
      query.andWhere('analysis.priority = :priority', { priority: filters.priority });
    }

    if (filters?.patientId) {
      query.andWhere('analysis.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('analysis.requestDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('analysis.priority', 'DESC').addOrderBy('analysis.requestDate', 'DESC').getMany();
  }

  async findOneAnalysis(id: string): Promise<Analysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      relations: ['patient', 'requestingDoctor', 'technician', 'validator', 'samples', 'results'],
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis ${id} not found`);
    }

    return analysis;
  }

  async findByNumero(numeroAnalyse: string): Promise<Analysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { numeroAnalyse },
      relations: ['patient', 'requestingDoctor', 'technician', 'validator', 'samples', 'results'],
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis ${numeroAnalyse} not found`);
    }

    return analysis;
  }

  async updateAnalysis(id: string, updateDto: any): Promise<Analysis> {
    const analysis = await this.findOneAnalysis(id);
    Object.assign(analysis, updateDto);
    const saved = await this.analysisRepository.save(analysis);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async updateStatus(id: string, status: AnalysisStatus, userId?: string, userName?: string): Promise<Analysis> {
    const analysis = await this.findOneAnalysis(id);
    analysis.status = status;

    if (status === AnalysisStatus.SAMPLE_COLLECTED && !analysis.sampleCollectionDate) {
      analysis.sampleCollectionDate = new Date();
    }

    if (status === AnalysisStatus.IN_PROGRESS && !analysis.analysisStartDate) {
      analysis.analysisStartDate = new Date();
      if (userId && userName) {
        analysis.performedBy = userId;
        analysis.performedByName = userName;
      }
    }

    if (status === AnalysisStatus.COMPLETED && !analysis.completionDate) {
      analysis.completionDate = new Date();
    }

    if (status === AnalysisStatus.VALIDATED && !analysis.validationDate) {
      analysis.validationDate = new Date();
      if (userId && userName) {
        analysis.validatedBy = userId;
        analysis.validatedByName = userName;
      }
    }

    const saved = await this.analysisRepository.save(analysis);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async createSample(createDto: any): Promise<Sample> {
    const numeroEchantillon = await this.generateSampleNumber();

    const sample = this.sampleRepository.create({
      ...createDto,
      numeroEchantillon,
      collectionDate: createDto.collectionDate || new Date(),
      status: SampleStatus.COLLECTED,
    });

    const savedSample = await this.sampleRepository.save(sample) as any as Sample;

    // Update analysis status
    await this.updateStatus(createDto.analysisId, AnalysisStatus.SAMPLE_COLLECTED);

    return savedSample;
  }

  async findSamplesByAnalysis(analysisId: string): Promise<Sample[]> {
    return await this.sampleRepository.find({
      where: { analysisId },
      relations: ['collector', 'receiver'],
      order: { collectionDate: 'DESC' },
    });
  }

  async updateSample(id: string, updateDto: any): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({ where: { id } });
    if (!sample) {
      throw new NotFoundException(`Sample ${id} not found`);
    }

    Object.assign(sample, updateDto);
    const saved = await this.sampleRepository.save(sample);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async createResult(createDto: any): Promise<Result> {
    const result = this.resultRepository.create({
      ...createDto,
      performedDate: new Date(),
    });

    const savedResult = await this.resultRepository.save(result) as any as Result;

    // Update analysis status if all results are ready
    await this.checkAnalysisCompletion(createDto.analysisId);

    return savedResult;
  }

  async findResultsByAnalysis(analysisId: string): Promise<Result[]> {
    return await this.resultRepository.find({
      where: { analysisId },
      relations: ['technician', 'validator'],
      order: { dateCreation: 'ASC' },
    });
  }

  async updateResult(id: string, updateDto: any): Promise<Result> {
    const result = await this.resultRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Result ${id} not found`);
    }

    Object.assign(result, updateDto);
    const saved = await this.resultRepository.save(result);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async validateResult(id: string, validatorId: string, validatorName: string): Promise<Result> {
    const result = await this.resultRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Result ${id} not found`);
    }

    result.validatedBy = validatorId;
    result.validatedByName = validatorName;
    result.validationDate = new Date();

    const saved = await this.resultRepository.save(result);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getStatistics(dateDebut?: Date, dateFin?: Date): Promise<any> {
    const query = this.analysisRepository.createQueryBuilder('analysis');

    if (dateDebut && dateFin) {
      query.where('analysis.requestDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut,
        dateFin,
      });
    }

    const total = await query.getCount();

    const byType = await this.analysisRepository
      .createQueryBuilder('analysis')
      .select('analysis.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'analysis.requestDate BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('analysis.type')
      .getRawMany();

    const byStatus = await this.analysisRepository
      .createQueryBuilder('analysis')
      .select('analysis.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(dateDebut && dateFin ? 'analysis.requestDate BETWEEN :dateDebut AND :dateFin' : '1=1', {
        dateDebut,
        dateFin,
      })
      .groupBy('analysis.status')
      .getRawMany();

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count, 10);
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      }, {}),
    };
  }

  private async checkAnalysisCompletion(analysisId: string): Promise<void> {
    const analysis = await this.findOneAnalysis(analysisId);

    if (analysis.results && analysis.results.length > 0) {
      const allCompleted = analysis.results.every(
        (r) => r.status !== ResultStatus.PENDING,
      );

      if (allCompleted && analysis.status !== AnalysisStatus.COMPLETED) {
        await this.updateStatus(analysisId, AnalysisStatus.COMPLETED);
      }
    }
  }

  private async generateAnalysisNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `AN-${year}-`;

    const lastAnalysis = await this.analysisRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastAnalysis && lastAnalysis.numeroAnalyse.startsWith(prefix)) {
      const lastNumber = parseInt(lastAnalysis.numeroAnalyse.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }

  private async generateSampleNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ECH-${year}-`;

    const lastSample = await this.sampleRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastSample && lastSample.numeroEchantillon.startsWith(prefix)) {
      const lastNumber = parseInt(lastSample.numeroEchantillon.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
