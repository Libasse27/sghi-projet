import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Consultation, ConsultationStatus } from '../entities/consultation.entity';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
  ) {}

  /**
   * Génère un numéro de consultation unique (C-YYYY-XXXX)
   */
  private async generateConsultationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `C-${year}-`;

    const lastConsultation = await this.consultationRepository.findOne({
      where: { numeroConsultation: Like(`${prefix}%`) },
      order: { numeroConsultation: 'DESC' },
    });

    let sequence = 1;
    if (lastConsultation) {
      const lastSequence = parseInt(lastConsultation.numeroConsultation.split('-')[2], 10);
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Créer une nouvelle consultation
   */
  async create(createDto: CreateConsultationDto): Promise<Consultation> {
    const numeroConsultation = await this.generateConsultationNumber();

    const consultation = this.consultationRepository.create({
      ...createDto,
      numeroConsultation,
      dateConsultation: new Date(createDto.dateConsultation),
      prochainRendezVous: createDto.prochainRendezVous
        ? new Date(createDto.prochainRendezVous)
        : null,
    });

    return await this.consultationRepository.save(consultation);
  }

  /**
   * Trouver toutes les consultations avec filtres
   */
  async findAll(filters?: {
    status?: ConsultationStatus;
    patientId?: string;
    doctorId?: string;
    dateDebut?: string;
    dateFin?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Consultation[]; total: number }> {
    const { page = 1, limit = 10, ...otherFilters } = filters || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.consultationRepository.createQueryBuilder('consultation');

    if (otherFilters.status) {
      queryBuilder.andWhere('consultation.status = :status', { status: otherFilters.status });
    }

    if (otherFilters.patientId) {
      queryBuilder.andWhere('consultation.patientId = :patientId', {
        patientId: otherFilters.patientId,
      });
    }

    if (otherFilters.doctorId) {
      queryBuilder.andWhere('consultation.doctorId = :doctorId', {
        doctorId: otherFilters.doctorId,
      });
    }

    if (otherFilters.dateDebut && otherFilters.dateFin) {
      queryBuilder.andWhere('consultation.dateConsultation BETWEEN :dateDebut AND :dateFin', {
        dateDebut: new Date(otherFilters.dateDebut),
        dateFin: new Date(otherFilters.dateFin),
      });
    }

    queryBuilder.orderBy('consultation.dateConsultation', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * Trouver une consultation par ID
   */
  async findOne(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation avec l'ID ${id} non trouvée`);
    }

    return consultation;
  }

  /**
   * Trouver une consultation par numéro
   */
  async findByNumber(numeroConsultation: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { numeroConsultation },
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation ${numeroConsultation} non trouvée`);
    }

    return consultation;
  }

  /**
   * Trouver les consultations d'un patient
   */
  async findByPatient(patientId: string): Promise<Consultation[]> {
    return await this.consultationRepository.find({
      where: { patientId },
      order: { dateConsultation: 'DESC' },
    });
  }

  /**
   * Trouver les consultations d'un médecin
   */
  async findByDoctor(doctorId: string, date?: string): Promise<Consultation[]> {
    const queryBuilder = this.consultationRepository.createQueryBuilder('consultation');

    queryBuilder.where('consultation.doctorId = :doctorId', { doctorId });

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      queryBuilder.andWhere('consultation.dateConsultation BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder.orderBy('consultation.dateConsultation', 'ASC');

    return await queryBuilder.getMany();
  }

  /**
   * Mettre à jour une consultation
   */
  async update(id: string, updateDto: UpdateConsultationDto): Promise<Consultation> {
    const consultation = await this.findOne(id);

    Object.assign(consultation, updateDto);

    if (updateDto.dateConsultation) {
      consultation.dateConsultation = new Date(updateDto.dateConsultation);
    }

    if (updateDto.prochainRendezVous) {
      consultation.prochainRendezVous = new Date(updateDto.prochainRendezVous);
    }

    return await this.consultationRepository.save(consultation);
  }

  /**
   * Changer le statut d'une consultation
   */
  async updateStatus(id: string, status: ConsultationStatus): Promise<Consultation> {
    const consultation = await this.findOne(id);
    consultation.status = status;
    return await this.consultationRepository.save(consultation);
  }

  /**
   * Commencer une consultation
   */
  async start(id: string): Promise<Consultation> {
    return await this.updateStatus(id, ConsultationStatus.IN_PROGRESS);
  }

  /**
   * Terminer une consultation
   */
  async complete(id: string): Promise<Consultation> {
    return await this.updateStatus(id, ConsultationStatus.COMPLETED);
  }

  /**
   * Annuler une consultation
   */
  async cancel(id: string): Promise<Consultation> {
    return await this.updateStatus(id, ConsultationStatus.CANCELLED);
  }

  /**
   * Supprimer une consultation
   */
  async remove(id: string): Promise<void> {
    const consultation = await this.findOne(id);
    await this.consultationRepository.remove(consultation);
  }

  /**
   * Obtenir les statistiques des consultations
   */
  async getStatistics(filters?: {
    dateDebut?: string;
    dateFin?: string;
    doctorId?: string;
  }): Promise<{
    total: number;
    parStatut: Record<string, number>;
    parType: Record<string, number>;
    totalMontant: number;
    montantPaye: number;
    montantImpaye: number;
  }> {
    const queryBuilder = this.consultationRepository.createQueryBuilder('consultation');

    if (filters?.dateDebut && filters?.dateFin) {
      queryBuilder.andWhere('consultation.dateConsultation BETWEEN :dateDebut AND :dateFin', {
        dateDebut: new Date(filters.dateDebut),
        dateFin: new Date(filters.dateFin),
      });
    }

    if (filters?.doctorId) {
      queryBuilder.andWhere('consultation.doctorId = :doctorId', {
        doctorId: filters.doctorId,
      });
    }

    const consultations = await queryBuilder.getMany();

    const parStatut = consultations.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parType = consultations.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalMontant = consultations.reduce((sum, c) => sum + (Number(c.montant) || 0), 0);
    const montantPaye = consultations
      .filter((c) => c.paye)
      .reduce((sum, c) => sum + (Number(c.montant) || 0), 0);
    const montantImpaye = totalMontant - montantPaye;

    return {
      total: consultations.length,
      parStatut,
      parType,
      totalMontant,
      montantPaye,
      montantImpaye,
    };
  }
}
