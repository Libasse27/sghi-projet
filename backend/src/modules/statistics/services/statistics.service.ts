import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getDashboardStatistics(filters?: any): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total patients
    const totalPatients = await this.patientRepository.count();

    // New patients this month
    const newPatientsThisMonth = await this.patientRepository.count({
      where: {
        dateCreation: Between(startOfMonth, new Date()),
      },
    });

    // New patients this year
    const newPatientsThisYear = await this.patientRepository.count({
      where: {
        dateCreation: Between(startOfYear, new Date()),
      },
    });

    // Patients by gender
    const patientsByGender = await this.patientRepository
      .createQueryBuilder('patient')
      .select('patient.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .groupBy('patient.gender')
      .getRawMany();

    // Patients by age group
    const patientsByAgeGroup = await this.calculateAgeGroupDistribution();

    return {
      totalPatients,
      newPatientsThisMonth,
      newPatientsThisYear,
      patientsByGender: patientsByGender.map((item) => ({
        gender: item.gender,
        count: parseInt(item.count),
      })),
      patientsByAgeGroup,
      lastUpdated: new Date(),
    };
  }

  async getPatientStatistics(filters?: any): Promise<any> {
    const query = this.patientRepository.createQueryBuilder('patient');

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('patient.dateCreation BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    const totalPatients = await query.getCount();

    const byGender = await query
      .clone()
      .select('patient.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .groupBy('patient.gender')
      .getRawMany();

    const byBloodGroup = await query
      .clone()
      .select('patient.bloodGroup', 'bloodGroup')
      .addSelect('COUNT(*)', 'count')
      .groupBy('patient.bloodGroup')
      .getRawMany();

    return {
      totalPatients,
      byGender: byGender.map((item) => ({
        gender: item.gender,
        count: parseInt(item.count),
      })),
      byBloodGroup: byBloodGroup.map((item) => ({
        bloodGroup: item.bloodGroup,
        count: parseInt(item.count),
      })),
    };
  }

  async getMonthlyTrends(year: number): Promise<any> {
    const trends = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const newPatients = await this.patientRepository.count({
        where: {
          dateCreation: Between(startDate, endDate),
        },
      });

      trends.push({
        month: month + 1,
        monthName: startDate.toLocaleString('default', { month: 'long' }),
        newPatients,
      });
    }

    return trends;
  }

  async getServiceUtilization(filters?: any): Promise<any> {
    // This would aggregate data from various modules
    // For now, returning a structure that can be filled by other services

    return {
      emergency: {
        total: 0,
        byPriority: [],
      },
      consultations: {
        total: 0,
        bySpecialty: [],
      },
      surgeries: {
        total: 0,
        byType: [],
      },
      laboratory: {
        total: 0,
        byCategory: [],
      },
      imaging: {
        total: 0,
        byModality: [],
      },
      pharmacy: {
        total: 0,
        topMedications: [],
      },
    };
  }

  async getRevenueStatistics(filters?: any): Promise<any> {
    // This would integrate with billing module
    return {
      totalRevenue: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      byService: [],
      monthlyTrend: [],
    };
  }

  private async calculateAgeGroupDistribution(): Promise<any[]> {
    const patients = await this.patientRepository.find();

    const ageGroups = {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51-60': 0,
      '61-70': 0,
      '71+': 0,
    };

    for (const patient of patients) {
      const age = this.calculateAge(patient.dateNaissance);

      if (age <= 10) ageGroups['0-10']++;
      else if (age <= 20) ageGroups['11-20']++;
      else if (age <= 30) ageGroups['21-30']++;
      else if (age <= 40) ageGroups['31-40']++;
      else if (age <= 50) ageGroups['41-50']++;
      else if (age <= 60) ageGroups['51-60']++;
      else if (age <= 70) ageGroups['61-70']++;
      else ageGroups['71+']++;
    }

    return Object.entries(ageGroups).map(([range, count]) => ({
      ageGroup: range,
      count,
    }));
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  async getTopDiagnoses(limit: number = 10, filters?: any): Promise<any[]> {
    // This would aggregate consultation diagnoses
    // Placeholder implementation
    return [];
  }

  async getOccupancyRate(filters?: any): Promise<any> {
    // This would integrate with hospitalization module
    return {
      totalBeds: 0,
      occupiedBeds: 0,
      availableBeds: 0,
      occupancyRate: 0,
      byDepartment: [],
    };
  }

  async getAverageWaitTime(filters?: any): Promise<any> {
    // This would integrate with emergency and appointments
    return {
      emergency: 0,
      consultation: 0,
      laboratory: 0,
      imaging: 0,
      pharmacy: 0,
    };
  }
}
