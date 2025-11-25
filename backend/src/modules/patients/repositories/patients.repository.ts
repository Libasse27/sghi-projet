import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientsRepository extends Repository<Patient> {
  constructor(private dataSource: DataSource) {
    super(Patient, dataSource.createEntityManager());
  }

  /**
   * Recherche avancée de patients avec plusieurs critères
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
    actif?: boolean;
  }): Promise<Patient[]> {
    const query = this.createQueryBuilder('patient');

    if (criteria.actif !== undefined) {
      query.andWhere('patient.actif = :actif', { actif: criteria.actif });
    }

    if (criteria.nom) {
      query.andWhere('LOWER(patient.nom) LIKE LOWER(:nom)', {
        nom: `%${criteria.nom}%`,
      });
    }

    if (criteria.prenom) {
      query.andWhere('LOWER(patient.prenom) LIKE LOWER(:prenom)', {
        prenom: `%${criteria.prenom}%`,
      });
    }

    if (criteria.telephone) {
      query.andWhere('patient.telephone LIKE :telephone', {
        telephone: `%${criteria.telephone}%`,
      });
    }

    if (criteria.email) {
      query.andWhere('LOWER(patient.email) LIKE LOWER(:email)', {
        email: `%${criteria.email}%`,
      });
    }

    if (criteria.numeroPatient) {
      query.andWhere('patient.numeroPatient = :numeroPatient', {
        numeroPatient: criteria.numeroPatient,
      });
    }

    if (criteria.sexe) {
      query.andWhere('patient.sexe = :sexe', { sexe: criteria.sexe });
    }

    if (criteria.groupeSanguin) {
      query.andWhere('patient.groupeSanguin = :groupeSanguin', {
        groupeSanguin: criteria.groupeSanguin,
      });
    }

    // Filtre par âge
    if (criteria.ageMin !== undefined || criteria.ageMax !== undefined) {
      const today = new Date();

      if (criteria.ageMax !== undefined) {
        const minBirthDate = new Date(
          today.getFullYear() - criteria.ageMax - 1,
          today.getMonth(),
          today.getDate(),
        );
        query.andWhere('patient.dateNaissance >= :minBirthDate', { minBirthDate });
      }

      if (criteria.ageMin !== undefined) {
        const maxBirthDate = new Date(
          today.getFullYear() - criteria.ageMin,
          today.getMonth(),
          today.getDate(),
        );
        query.andWhere('patient.dateNaissance <= :maxBirthDate', { maxBirthDate });
      }
    }

    return await query.orderBy('patient.dateCreation', 'DESC').getMany();
  }

  /**
   * Trouver les patients avec assurance expirée ou proche de l'expiration
   */
  async findPatientsWithExpiringInsurance(daysBeforeExpiration: number = 30): Promise<Patient[]> {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + daysBeforeExpiration);

    return await this.createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere('patient.assuranceExpiration IS NOT NULL')
      .andWhere('patient.assuranceExpiration BETWEEN :today AND :expirationDate', {
        today,
        expirationDate,
      })
      .orderBy('patient.assuranceExpiration', 'ASC')
      .getMany();
  }

  /**
   * Statistiques par groupe sanguin
   */
  async getBloodGroupStatistics(): Promise<Record<string, number>> {
    const results = await this.createQueryBuilder('patient')
      .select('patient.groupeSanguin', 'groupeSanguin')
      .addSelect('COUNT(*)', 'count')
      .where('patient.actif = :actif', { actif: true })
      .andWhere('patient.groupeSanguin IS NOT NULL')
      .groupBy('patient.groupeSanguin')
      .getRawMany();

    return results.reduce((acc, item) => {
      acc[item.groupeSanguin] = parseInt(item.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Trouver les patients par tranche d'âge
   */
  async findByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const minBirthDate = new Date(
      today.getFullYear() - maxAge - 1,
      today.getMonth(),
      today.getDate(),
    );

    return await this.createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere('patient.dateNaissance BETWEEN :minBirthDate AND :maxBirthDate', {
        minBirthDate,
        maxBirthDate,
      })
      .orderBy('patient.dateNaissance', 'DESC')
      .getMany();
  }

  /**
   * Recherche full-text sur patients
   */
  async fullTextSearch(searchTerm: string): Promise<Patient[]> {
    return await this.createQueryBuilder('patient')
      .where('patient.actif = :actif', { actif: true })
      .andWhere(
        '(LOWER(patient.nom) LIKE LOWER(:search) OR ' +
          'LOWER(patient.prenom) LIKE LOWER(:search) OR ' +
          'patient.numeroPatient LIKE :search OR ' +
          'patient.telephone LIKE :search OR ' +
          'LOWER(patient.email) LIKE LOWER(:search))',
        { search: `%${searchTerm}%` },
      )
      .orderBy('patient.dateCreation', 'DESC')
      .limit(50)
      .getMany();
  }
}
