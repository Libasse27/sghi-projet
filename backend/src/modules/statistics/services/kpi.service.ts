import { Injectable } from '@nestjs/common';

interface KPI {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
}

@Injectable()
export class KpiService {
  async getHospitalKPIs(filters?: any): Promise<KPI[]> {
    // In production, these would be calculated from actual data
    return [
      {
        name: 'Patient Satisfaction',
        value: 87,
        unit: '%',
        target: 90,
        status: 'warning',
        trend: 'up',
        changePercent: 3.5,
      },
      {
        name: 'Bed Occupancy Rate',
        value: 75,
        unit: '%',
        target: 80,
        status: 'good',
        trend: 'stable',
        changePercent: 0.5,
      },
      {
        name: 'Average Length of Stay',
        value: 4.2,
        unit: 'days',
        target: 4.0,
        status: 'warning',
        trend: 'up',
        changePercent: 5.0,
      },
      {
        name: 'Emergency Response Time',
        value: 12,
        unit: 'minutes',
        target: 15,
        status: 'good',
        trend: 'down',
        changePercent: -8.5,
      },
      {
        name: 'Staff-to-Patient Ratio',
        value: 0.8,
        unit: 'ratio',
        target: 1.0,
        status: 'critical',
        trend: 'down',
        changePercent: -5.2,
      },
      {
        name: 'Readmission Rate',
        value: 8.5,
        unit: '%',
        target: 10.0,
        status: 'good',
        trend: 'down',
        changePercent: -12.0,
      },
      {
        name: 'Medication Error Rate',
        value: 0.3,
        unit: '%',
        target: 0.5,
        status: 'good',
        trend: 'down',
        changePercent: -15.5,
      },
      {
        name: 'Surgery Success Rate',
        value: 96.5,
        unit: '%',
        target: 95.0,
        status: 'good',
        trend: 'up',
        changePercent: 1.2,
      },
    ];
  }

  async getFinancialKPIs(filters?: any): Promise<KPI[]> {
    return [
      {
        name: 'Revenue per Patient',
        value: 125000,
        unit: 'XOF',
        target: 120000,
        status: 'good',
        trend: 'up',
        changePercent: 8.3,
      },
      {
        name: 'Collection Rate',
        value: 88,
        unit: '%',
        target: 90,
        status: 'warning',
        trend: 'stable',
        changePercent: 0.2,
      },
      {
        name: 'Operating Margin',
        value: 15.5,
        unit: '%',
        target: 18.0,
        status: 'warning',
        trend: 'down',
        changePercent: -2.5,
      },
      {
        name: 'Days in Accounts Receivable',
        value: 42,
        unit: 'days',
        target: 45,
        status: 'good',
        trend: 'down',
        changePercent: -6.7,
      },
      {
        name: 'Cost per Admission',
        value: 85000,
        unit: 'XOF',
        target: 90000,
        status: 'good',
        trend: 'down',
        changePercent: -5.6,
      },
    ];
  }

  async getOperationalKPIs(filters?: any): Promise<KPI[]> {
    return [
      {
        name: 'Appointment No-Show Rate',
        value: 12,
        unit: '%',
        target: 10,
        status: 'warning',
        trend: 'up',
        changePercent: 3.4,
      },
      {
        name: 'Lab Test Turnaround Time',
        value: 3.5,
        unit: 'hours',
        target: 4.0,
        status: 'good',
        trend: 'down',
        changePercent: -7.9,
      },
      {
        name: 'Pharmacy Wait Time',
        value: 18,
        unit: 'minutes',
        target: 20,
        status: 'good',
        trend: 'stable',
        changePercent: 0.8,
      },
      {
        name: 'Equipment Utilization',
        value: 72,
        unit: '%',
        target: 75,
        status: 'warning',
        trend: 'up',
        changePercent: 2.1,
      },
      {
        name: 'Staff Overtime Hours',
        value: 120,
        unit: 'hours',
        target: 100,
        status: 'warning',
        trend: 'up',
        changePercent: 15.5,
      },
    ];
  }

  async getQualityKPIs(filters?: any): Promise<KPI[]> {
    return [
      {
        name: 'Hand Hygiene Compliance',
        value: 92,
        unit: '%',
        target: 95,
        status: 'warning',
        trend: 'up',
        changePercent: 2.2,
      },
      {
        name: 'Hospital Acquired Infection Rate',
        value: 2.1,
        unit: '%',
        target: 2.5,
        status: 'good',
        trend: 'down',
        changePercent: -8.7,
      },
      {
        name: 'Mortality Rate',
        value: 1.8,
        unit: '%',
        target: 2.0,
        status: 'good',
        trend: 'down',
        changePercent: -10.0,
      },
      {
        name: 'Patient Falls per 1000 Days',
        value: 2.5,
        unit: 'rate',
        target: 3.0,
        status: 'good',
        trend: 'stable',
        changePercent: 0.0,
      },
      {
        name: 'Pressure Ulcer Prevalence',
        value: 4.2,
        unit: '%',
        target: 5.0,
        status: 'good',
        trend: 'down',
        changePercent: -6.7,
      },
    ];
  }

  async getStaffKPIs(filters?: any): Promise<KPI[]> {
    return [
      {
        name: 'Staff Turnover Rate',
        value: 12,
        unit: '%',
        target: 10,
        status: 'warning',
        trend: 'up',
        changePercent: 9.1,
      },
      {
        name: 'Staff Satisfaction',
        value: 78,
        unit: '%',
        target: 80,
        status: 'warning',
        trend: 'down',
        changePercent: -2.5,
      },
      {
        name: 'Training Hours per Employee',
        value: 42,
        unit: 'hours',
        target: 40,
        status: 'good',
        trend: 'up',
        changePercent: 5.0,
      },
      {
        name: 'Absenteeism Rate',
        value: 3.8,
        unit: '%',
        target: 4.0,
        status: 'good',
        trend: 'down',
        changePercent: -5.0,
      },
      {
        name: 'Productivity Score',
        value: 85,
        unit: 'score',
        target: 80,
        status: 'good',
        trend: 'up',
        changePercent: 6.3,
      },
    ];
  }

  async getAllKPIs(filters?: any): Promise<any> {
    const hospitalKPIs = await this.getHospitalKPIs(filters);
    const financialKPIs = await this.getFinancialKPIs(filters);
    const operationalKPIs = await this.getOperationalKPIs(filters);
    const qualityKPIs = await this.getQualityKPIs(filters);
    const staffKPIs = await this.getStaffKPIs(filters);

    return {
      hospital: hospitalKPIs,
      financial: financialKPIs,
      operational: operationalKPIs,
      quality: qualityKPIs,
      staff: staffKPIs,
      summary: {
        totalKPIs: hospitalKPIs.length + financialKPIs.length + operationalKPIs.length + qualityKPIs.length + staffKPIs.length,
        good: this.countByStatus([...hospitalKPIs, ...financialKPIs, ...operationalKPIs, ...qualityKPIs, ...staffKPIs], 'good'),
        warning: this.countByStatus([...hospitalKPIs, ...financialKPIs, ...operationalKPIs, ...qualityKPIs, ...staffKPIs], 'warning'),
        critical: this.countByStatus([...hospitalKPIs, ...financialKPIs, ...operationalKPIs, ...qualityKPIs, ...staffKPIs], 'critical'),
      },
    };
  }

  async calculateKPITrends(kpiName: string, period: string = '6months'): Promise<any> {
    // In production, this would fetch historical data
    const months = 6;
    const trends = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      trends.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        value: Math.random() * 100, // Placeholder
      });
    }

    return {
      kpiName,
      period,
      data: trends,
    };
  }

  private countByStatus(kpis: KPI[], status: string): number {
    return kpis.filter((kpi) => kpi.status === status).length;
  }
}
