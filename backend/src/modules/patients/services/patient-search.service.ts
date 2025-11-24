import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientSearchService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Recherche avancée de patients
   */
  async advancedSearch(criteria: {
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    numeroPatient?: string;
    sexe?: string;
    groupeSanguin?: string;
    ageMin?: number;
    ageMax?: number;
    profession?: string;
    assuranceNom?: string;
  }): Promise<Patient[]> {
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    queryBuilder.where('patient.actif = :actif', { actif: true });

    if (criteria.nom) {
      queryBuilder.andWhere('LOWER(patient.nom) LIKE LOWER(:nom)', {
        nom: `%${criteria.nom}%`,
      });
    }

    if (criteria.prenom) {
      queryBuilder.andWhere('LOWER(patient.prenom) LIKE LOWER(:prenom)', {
        prenom: `%${criteria.prenom}%`,
      });
    }

    if (criteria.telephone) {
      queryBuilder.andWhere('patient.telephone LIKE :telephone', {
        telephone: `%${criteria.telephone}%`,
      });
    }

    if (criteria.email) {
      queryBuilder.andWhere('LOWER(patient.email) LIKE LOWER(:email)', {
        email: `%${criteria.email}%`,
      });
    }

    if (criteria.numeroPatient) {
      queryBuilder.andWhere('patient.numeroPatient = :numeroPatient', {
        numeroPatient: criteria.numeroPatient,
      });
    }

    if (criteria.sexe) {
      queryBuilder.andWhere('patient.sexe = :sexe', { sexe: criteria.sexe });
    }

    if (criteria.groupeSanguin) {
      queryBuilder.andWhere('patient.groupeSanguin = :groupeSanguin', {
        groupeSanguin: criteria.groupeSanguin,
      });
    }

    if (criteria.profession) {
      queryBuilder.andWhere('LOWER(patient.profession) LIKE LOWER(:profession)', {
        profession: `%${criteria.profession}%`,
      });
    }

    if (criteria.assuranceNom) {
      queryBuilder.andWhere('LOWER(patient.assuranceNom) LIKE LOWER(:assuranceNom)', {
        assuranceNom: `%${criteria.assuranceNom}%`,
      });
    }

    // Filtre par âge
    if (criteria.ageMin !== undefined || criteria.ageMax !== undefined) {
      const today = new Date();

      if (criteria.ageMax !== undefined) {
        const minBirthDate = new Date(today.getFullYear() - criteria.ageMax - 1, today.getMonth(), today.getDate());
        queryBuilder.andWhere('patient.dateNaissance >= :minBirthDate', { minBirthDate });
      }

      if (criteria.ageMin !== undefined) {
        const maxBirthDate = new Date(today.getFullYear() - criteria.ageMin, today.getMonth(), today.getDate());
        queryBuilder.andWhere('patient.dateNaissance <= :maxBirthDate', { maxBirthDate });
      }
    }

    queryBuilder.orderBy('patient.dateCreation', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Recherche rapide (nom, prénom, numéro)
   */
  async quickSearch(query: string): Promise<Patient[]> {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere(
        '(LOWER(patient.nom) LIKE LOWER(:query) OR LOWER(patient.prenom) LIKE LOWER(:query) OR patient.numeroPatient LIKE :query OR patient.telephone LIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('patient.dateCreation', 'DESC')
      .limit(20)
      .getMany();
  }

  /**
   * Rechercher des patients par tranche d'âge
   */
  async searchByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());

    return await this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere('patient.dateNaissance BETWEEN :minBirthDate AND :maxBirthDate', {
        minBirthDate,
        maxBirthDate,
      })
      .orderBy('patient.dateNaissance', 'DESC')
      .getMany();
  }

  /**
   * Rechercher des patients avec assurance expirée
   */
  async findPatientsWithExpiredInsurance(): Promise<Patient[]> {
    const today = new Date();

    return await this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere('patient.assuranceExpiration IS NOT NULL')
      .andWhere('patient.assuranceExpiration < :today', { today })
      .orderBy('patient.assuranceExpiration', 'ASC')
      .getMany();
  }

  /**
   * Rechercher des patients par groupe sanguin
   */
  async findByBloodGroup(bloodGroup: string): Promise<Patient[]> {
    return await this.patientRepository.find({
      where: { groupeSanguin: bloodGroup as any, actif: true },
      order: { dateCreation: 'DESC' },
    });
  }
}
