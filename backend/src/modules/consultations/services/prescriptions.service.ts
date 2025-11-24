import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';

export class CreatePrescriptionDto {
  consultationId: string;
  patientId: string;
  patientNom: string;
  doctorId: string;
  doctorName: string;
  datePrescription: string;
  medicaments: Array<{
    nom: string;
    dosage: string;
    forme: string;
    quantite: number;
    frequence: string;
    duree: string;
    instructions: string;
  }>;
  instructions?: string;
  dureeTotale?: string;
  renouvelable?: boolean;
  nombreRenouvellements?: number;
  dateExpiration?: string;
}

export class UpdatePrescriptionDto {
  medicaments?: Array<{
    nom: string;
    dosage: string;
    forme: string;
    quantite: number;
    frequence: string;
    duree: string;
    instructions: string;
  }>;
  instructions?: string;
  dureeTotale?: string;
  renouvelable?: boolean;
  nombreRenouvellements?: number;
  status?: string;
  dateExpiration?: string;
}

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
  ) {}

  /**
   * Génère un numéro d'ordonnance unique (ORD-YYYY-XXXX)
   */
  private async generatePrescriptionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const lastPrescription = await this.prescriptionRepository.findOne({
      where: { numeroPrescription: Like(`${prefix}%`) },
      order: { numeroPrescription: 'DESC' },
    });

    let sequence = 1;
    if (lastPrescription) {
      const lastSequence = parseInt(lastPrescription.numeroPrescription.split('-')[2], 10);
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Créer une nouvelle ordonnance
   */
  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    const numeroPrescription = await this.generatePrescriptionNumber();

    const prescription = this.prescriptionRepository.create({
      ...createDto,
      numeroPrescription,
      datePrescription: new Date(createDto.datePrescription),
      dateExpiration: createDto.dateExpiration ? new Date(createDto.dateExpiration) : null,
    });

    return await this.prescriptionRepository.save(prescription);
  }

  /**
   * Trouver toutes les ordonnances d'un patient
   */
  async findByPatient(patientId: string): Promise<Prescription[]> {
    return await this.prescriptionRepository.find({
      where: { patientId },
      order: { datePrescription: 'DESC' },
    });
  }

  /**
   * Trouver toutes les ordonnances d'une consultation
   */
  async findByConsultation(consultationId: string): Promise<Prescription[]> {
    return await this.prescriptionRepository.find({
      where: { consultationId },
      order: { datePrescription: 'DESC' },
    });
  }

  /**
   * Trouver une ordonnance par ID
   */
  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['consultation'],
    });

    if (!prescription) {
      throw new NotFoundException(`Ordonnance avec l'ID ${id} non trouvée`);
    }

    return prescription;
  }

  /**
   * Trouver une ordonnance par numéro
   */
  async findByNumber(numeroPrescription: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { numeroPrescription },
      relations: ['consultation'],
    });

    if (!prescription) {
      throw new NotFoundException(`Ordonnance ${numeroPrescription} non trouvée`);
    }

    return prescription;
  }

  /**
   * Mettre à jour une ordonnance
   */
  async update(id: string, updateDto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.findOne(id);

    Object.assign(prescription, updateDto);

    if (updateDto.dateExpiration) {
      prescription.dateExpiration = new Date(updateDto.dateExpiration);
    }

    return await this.prescriptionRepository.save(prescription);
  }

  /**
   * Changer le statut d'une ordonnance
   */
  async updateStatus(id: string, status: string): Promise<Prescription> {
    const prescription = await this.findOne(id);
    prescription.status = status;
    return await this.prescriptionRepository.save(prescription);
  }

  /**
   * Annuler une ordonnance
   */
  async cancel(id: string): Promise<Prescription> {
    return await this.updateStatus(id, 'Annulé');
  }

  /**
   * Supprimer une ordonnance
   */
  async remove(id: string): Promise<void> {
    const prescription = await this.findOne(id);
    await this.prescriptionRepository.remove(prescription);
  }

  /**
   * Trouver les ordonnances actives d'un patient
   */
  async findActiveByPatient(patientId: string): Promise<Prescription[]> {
    const today = new Date();

    return await this.prescriptionRepository
      .createQueryBuilder('prescription')
      .where('prescription.patientId = :patientId', { patientId })
      .andWhere('prescription.status = :status', { status: 'Active' })
      .andWhere('(prescription.dateExpiration IS NULL OR prescription.dateExpiration >= :today)', {
        today,
      })
      .orderBy('prescription.datePrescription', 'DESC')
      .getMany();
  }
}
