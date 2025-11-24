import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../entities/medical-record.entity';
import { PatientsService } from './patients.service';

export class CreateMedicalRecordDto {
  patientId: string;
  type: string;
  recordDate: string;
  doctorId?: string;
  doctorName?: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  examinations?: string;
  results?: string;
  notes?: string;
  temperature?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  status?: string;
  attachments?: string[];
}

export class UpdateMedicalRecordDto {
  type?: string;
  recordDate?: string;
  doctorId?: string;
  doctorName?: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  examinations?: string;
  results?: string;
  notes?: string;
  temperature?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  status?: string;
  attachments?: string[];
}

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly patientsService: PatientsService,
  ) {}

  /**
   * Créer un nouveau dossier médical
   */
  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    // Vérifier que le patient existe
    await this.patientsService.findOne(createDto.patientId);

    const medicalRecord = this.medicalRecordRepository.create({
      ...createDto,
      recordDate: new Date(createDto.recordDate),
      status: createDto.status || 'En cours',
    });

    return await this.medicalRecordRepository.save(medicalRecord);
  }

  /**
   * Trouver tous les dossiers d'un patient
   */
  async findByPatient(patientId: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordRepository.find({
      where: { patientId },
      order: { recordDate: 'DESC' },
    });
  }

  /**
   * Trouver un dossier médical par ID
   */
  async findOne(id: string): Promise<MedicalRecord> {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Dossier médical avec l'ID ${id} non trouvé`);
    }

    return record;
  }

  /**
   * Mettre à jour un dossier médical
   */
  async update(id: string, updateDto: UpdateMedicalRecordDto): Promise<MedicalRecord> {
    const record = await this.findOne(id);

    Object.assign(record, updateDto);

    if (updateDto.recordDate) {
      record.recordDate = new Date(updateDto.recordDate);
    }

    return await this.medicalRecordRepository.save(record);
  }

  /**
   * Changer le statut d'un dossier médical
   */
  async updateStatus(id: string, status: string): Promise<MedicalRecord> {
    const record = await this.findOne(id);
    record.status = status;
    return await this.medicalRecordRepository.save(record);
  }

  /**
   * Supprimer un dossier médical
   */
  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.medicalRecordRepository.remove(record);
  }

  /**
   * Obtenir les statistiques des dossiers médicaux d'un patient
   */
  async getPatientStatistics(patientId: string): Promise<{
    total: number;
    parType: Record<string, number>;
    parStatut: Record<string, number>;
  }> {
    const records = await this.findByPatient(patientId);

    const parType = records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parStatut = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: records.length,
      parType,
      parStatut,
    };
  }
}
