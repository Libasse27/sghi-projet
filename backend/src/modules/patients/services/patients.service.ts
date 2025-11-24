import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { SearchPatientDto } from '../dto/search-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Génère un numéro de patient unique (P-YYYY-XXX)
   */
  private async generatePatientNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `P-${year}-`;

    // Trouve le dernier numéro de patient de l'année
    const lastPatient = await this.patientRepository.findOne({
      where: { numeroPatient: Like(`${prefix}%`) },
      order: { numeroPatient: 'DESC' },
    });

    let sequence = 1;
    if (lastPatient) {
      const lastSequence = parseInt(lastPatient.numeroPatient.split('-')[2], 10);
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Créer un nouveau patient
   */
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Vérifier si un patient avec le même téléphone existe déjà
    if (createPatientDto.telephone) {
      const existingPatient = await this.patientRepository.findOne({
        where: { telephone: createPatientDto.telephone },
      });

      if (existingPatient) {
        throw new ConflictException('Un patient avec ce numéro de téléphone existe déjà');
      }
    }

    // Vérifier l'email s'il est fourni
    if (createPatientDto.email) {
      const existingEmail = await this.patientRepository.findOne({
        where: { email: createPatientDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Un patient avec cet email existe déjà');
      }
    }

    // Générer le numéro de patient
    const numeroPatient = await this.generatePatientNumber();

    // Créer le patient
    const patient = this.patientRepository.create({
      ...createPatientDto,
      numeroPatient,
      dateNaissance: new Date(createPatientDto.dateNaissance),
      assuranceExpiration: createPatientDto.assuranceExpiration
        ? new Date(createPatientDto.assuranceExpiration)
        : null,
    });

    return await this.patientRepository.save(patient);
  }

  /**
   * Rechercher des patients avec filtres
   */
  async search(searchDto: SearchPatientDto): Promise<{ data: Patient[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'dateCreation', sortOrder = 'DESC', ...filters } = searchDto;

    const where: FindOptionsWhere<Patient> = {};

    // Filtre par statut actif
    if (filters.actif !== undefined) {
      where.actif = filters.actif;
    }

    // Filtre par numéro de patient
    if (filters.numeroPatient) {
      where.numeroPatient = filters.numeroPatient;
    }

    // Filtre par sexe
    if (filters.sexe) {
      where.sexe = filters.sexe;
    }

    // Filtre par groupe sanguin
    if (filters.groupeSanguin) {
      where.groupeSanguin = filters.groupeSanguin;
    }

    // Filtre par téléphone
    if (filters.telephone) {
      where.telephone = Like(`%${filters.telephone}%`);
    }

    // Filtre par email
    if (filters.email) {
      where.email = Like(`%${filters.email}%`);
    }

    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    // Appliquer les filtres where
    Object.keys(where).forEach((key) => {
      queryBuilder.andWhere(`patient.${key} = :${key}`, { [key]: where[key] });
    });

    // Recherche par nom ou prénom
    if (filters.search) {
      queryBuilder.andWhere(
        '(LOWER(patient.nom) LIKE LOWER(:search) OR LOWER(patient.prenom) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    // Tri
    queryBuilder.orderBy(`patient.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Trouver tous les patients (avec pagination)
   */
  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Patient[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.patientRepository.findAndCount({
      where: { actif: true },
      order: { dateCreation: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  /**
   * Trouver un patient par ID
   */
  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient avec l'ID ${id} non trouvé`);
    }

    return patient;
  }

  /**
   * Trouver un patient par numéro
   */
  async findByNumber(numeroPatient: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { numeroPatient },
    });

    if (!patient) {
      throw new NotFoundException(`Patient avec le numéro ${numeroPatient} non trouvé`);
    }

    return patient;
  }

  /**
   * Mettre à jour un patient
   */
  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    // Vérifier les doublons pour le téléphone
    if (updatePatientDto.telephone && updatePatientDto.telephone !== patient.telephone) {
      const existingPatient = await this.patientRepository.findOne({
        where: { telephone: updatePatientDto.telephone },
      });

      if (existingPatient && existingPatient.id !== id) {
        throw new ConflictException('Un autre patient avec ce numéro de téléphone existe déjà');
      }
    }

    // Vérifier les doublons pour l'email
    if (updatePatientDto.email && updatePatientDto.email !== patient.email) {
      const existingEmail = await this.patientRepository.findOne({
        where: { email: updatePatientDto.email },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Un autre patient avec cet email existe déjà');
      }
    }

    // Mettre à jour
    Object.assign(patient, updatePatientDto);

    if (updatePatientDto.dateNaissance) {
      patient.dateNaissance = new Date(updatePatientDto.dateNaissance);
    }

    if (updatePatientDto.assuranceExpiration) {
      patient.assuranceExpiration = new Date(updatePatientDto.assuranceExpiration);
    }

    return await this.patientRepository.save(patient);
  }

  /**
   * Désactiver un patient (soft delete)
   */
  async deactivate(id: string): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.actif = false;
    return await this.patientRepository.save(patient);
  }

  /**
   * Réactiver un patient
   */
  async reactivate(id: string): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.actif = true;
    return await this.patientRepository.save(patient);
  }

  /**
   * Supprimer définitivement un patient (hard delete)
   */
  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }

  /**
   * Obtenir les statistiques des patients
   */
  async getStatistics(): Promise<{
    total: number;
    actifs: number;
    inactifs: number;
    parSexe: { homme: number; femme: number };
    parGroupeSanguin: Record<string, number>;
  }> {
    const [total, actifs, inactifs, hommes, femmes] = await Promise.all([
      this.patientRepository.count(),
      this.patientRepository.count({ where: { actif: true } }),
      this.patientRepository.count({ where: { actif: false } }),
      this.patientRepository.count({ where: { sexe: 'M' } }),
      this.patientRepository.count({ where: { sexe: 'F' } }),
    ]);

    // Statistiques par groupe sanguin
    const parGroupeSanguin = await this.patientRepository
      .createQueryBuilder('patient')
      .select('patient.groupeSanguin', 'groupeSanguin')
      .addSelect('COUNT(*)', 'count')
      .where('patient.groupeSanguin IS NOT NULL')
      .groupBy('patient.groupeSanguin')
      .getRawMany();

    const groupeSanguinStats = parGroupeSanguin.reduce((acc, item) => {
      acc[item.groupeSanguin] = parseInt(item.count, 10);
      return acc;
    }, {});

    return {
      total,
      actifs,
      inactifs,
      parSexe: {
        homme: hommes,
        femme: femmes,
      },
      parGroupeSanguin: groupeSanguinStats,
    };
  }
}
