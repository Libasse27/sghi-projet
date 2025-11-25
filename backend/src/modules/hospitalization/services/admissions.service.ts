import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admission, AdmissionStatus } from '../entities/admission.entity';
import { BedsService } from './beds.service';
import { BedStatus } from '../entities/bed.entity';

@Injectable()
export class AdmissionsService {
  constructor(
    @InjectRepository(Admission)
    private admissionRepository: Repository<Admission>,
    private bedsService: BedsService,
  ) {}

  async create(createDto: any): Promise<Admission> {
    const numeroAdmission = await this.generateAdmissionNumber();

    const admission = this.admissionRepository.create({
      ...createDto,
      numeroAdmission,
      admissionDate: createDto.admissionDate || new Date(),
      status: AdmissionStatus.ADMITTED,
    });

    const savedAdmission = await this.admissionRepository.save(admission) as any as Admission;

    await this.bedsService.updateStatus(createDto.bedId, BedStatus.OCCUPIED);

    return savedAdmission;
  }

  async findAll(filters?: any): Promise<Admission[]> {
    const query = this.admissionRepository
      .createQueryBuilder('admission')
      .leftJoinAndSelect('admission.patient', 'patient')
      .leftJoinAndSelect('admission.doctor', 'doctor')
      .leftJoinAndSelect('admission.bed', 'bed')
      .leftJoinAndSelect('bed.room', 'room');

    if (filters?.status) {
      query.andWhere('admission.status = :status', { status: filters.status });
    }

    if (filters?.patientId) {
      query.andWhere('admission.patientId = :patientId', { patientId: filters.patientId });
    }

    return await query.orderBy('admission.admissionDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Admission> {
    const admission = await this.admissionRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'bed', 'bed.room', 'nursingNotes'],
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${id} not found`);
    }

    return admission;
  }

  async update(id: string, updateDto: any): Promise<Admission> {
    const admission = await this.findOne(id);
    Object.assign(admission, updateDto);
    const saved = await this.admissionRepository.save(admission);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async discharge(id: string, dischargeSummary: string): Promise<Admission> {
    const admission = await this.findOne(id);
    admission.status = AdmissionStatus.DISCHARGED;
    admission.dischargeDate = new Date();
    admission.dischargeSummary = dischargeSummary;

    const updated = await this.admissionRepository.save(admission);

    await this.bedsService.updateStatus(admission.bedId, BedStatus.CLEANING);

    return updated;
  }

  async getActiveAdmissions(): Promise<Admission[]> {
    return await this.admissionRepository.find({
      where: [
        { status: AdmissionStatus.ADMITTED },
        { status: AdmissionStatus.IN_TREATMENT },
      ],
      relations: ['patient', 'doctor', 'bed', 'bed.room'],
      order: { admissionDate: 'DESC' },
    });
  }

  private async generateAdmissionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ADM-${year}-`;

    const lastAdmission = await this.admissionRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastAdmission && lastAdmission.numeroAdmission.startsWith(prefix)) {
      const lastNumber = parseInt(lastAdmission.numeroAdmission.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
