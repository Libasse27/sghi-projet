import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { Schedule } from '../entities/schedule.entity';

interface PayrollCalculation {
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  daysWorked: number;
  hoursWorked: number;
  overtimeHours: number;
  overtimePay: number;
  deductions: number;
  bonuses: number;
  grossPay: number;
  netPay: number;
  taxAmount: number;
  socialSecurityAmount: number;
}

@Injectable()
export class PayrollService {
  // Tax rates (example for Senegal)
  private readonly TAX_RATE = 0.20; // 20% income tax
  private readonly SOCIAL_SECURITY_RATE = 0.14; // 14% social security
  private readonly OVERTIME_RATE = 1.5; // 1.5x for overtime

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async calculateMonthlyPayroll(month: number, year: number): Promise<PayrollCalculation[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const employees = await this.employeeRepository.find({
      where: { status: 'ACTIVE' as any },
    });

    const payrollResults: PayrollCalculation[] = [];

    for (const employee of employees) {
      const calculation = await this.calculateEmployeePayroll(employee, startDate, endDate);
      payrollResults.push(calculation);
    }

    return payrollResults;
  }

  async calculateEmployeePayroll(
    employee: Employee,
    startDate: Date,
    endDate: Date,
  ): Promise<PayrollCalculation> {
    // Get attendance records
    const attendances = await this.attendanceRepository.find({
      where: {
        employeeId: employee.id,
        attendanceDate: Between(startDate, endDate),
      },
    });

    // Count working days
    const daysWorked = attendances.filter(
      (a) =>
        a.status === AttendanceStatus.PRESENT ||
        a.status === AttendanceStatus.LATE ||
        a.status === AttendanceStatus.HALF_DAY,
    ).length;

    // Calculate total hours worked
    const hoursWorked = attendances.reduce((total, a) => total + (a.hoursWorked || 0), 0);

    // Get overtime hours
    const schedules = await this.scheduleRepository.find({
      where: {
        employeeId: employee.id,
        scheduleDate: Between(startDate, endDate),
        isOvertime: true,
      },
    });

    const overtimeHours = schedules.reduce((total, s) => total + (s.overtimeHours || 0), 0);

    // Calculate base pay
    const baseSalary = employee.salary;

    // Calculate overtime pay
    const hourlyRate = baseSalary / 173.33; // Average hours per month
    const overtimePay = overtimeHours * hourlyRate * this.OVERTIME_RATE;

    // Calculate gross pay
    let grossPay = baseSalary + overtimePay;

    // Add bonuses (could be stored in a separate table)
    const bonuses = 0; // Placeholder

    grossPay += bonuses;

    // Calculate deductions
    const taxAmount = this.calculateTax(grossPay);
    const socialSecurityAmount = grossPay * this.SOCIAL_SECURITY_RATE;
    const deductions = taxAmount + socialSecurityAmount;

    // Calculate net pay
    const netPay = grossPay - deductions;

    return {
      employeeId: employee.id,
      employeeNumber: employee.employeeNumber,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      baseSalary,
      daysWorked,
      hoursWorked,
      overtimeHours,
      overtimePay,
      deductions,
      bonuses,
      grossPay,
      netPay,
      taxAmount,
      socialSecurityAmount,
    };
  }

  async calculateEmployeePayrollById(
    employeeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PayrollCalculation> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return await this.calculateEmployeePayroll(employee, startDate, endDate);
  }

  async getPayrollSummary(month: number, year: number): Promise<any> {
    const payrollData = await this.calculateMonthlyPayroll(month, year);

    const totalBaseSalary = payrollData.reduce((sum, p) => sum + p.baseSalary, 0);
    const totalOvertimePay = payrollData.reduce((sum, p) => sum + p.overtimePay, 0);
    const totalBonuses = payrollData.reduce((sum, p) => sum + p.bonuses, 0);
    const totalGrossPay = payrollData.reduce((sum, p) => sum + p.grossPay, 0);
    const totalDeductions = payrollData.reduce((sum, p) => sum + p.deductions, 0);
    const totalNetPay = payrollData.reduce((sum, p) => sum + p.netPay, 0);

    const byDepartment = this.groupPayrollByDepartment(payrollData);

    return {
      month,
      year,
      totalEmployees: payrollData.length,
      totalBaseSalary,
      totalOvertimePay,
      totalBonuses,
      totalGrossPay,
      totalDeductions,
      totalNetPay,
      byDepartment,
    };
  }

  async generatePayslip(employeeId: string, month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const payrollData = await this.calculateEmployeePayrollById(employeeId, startDate, endDate);

    return {
      ...payrollData,
      month,
      year,
      generatedDate: new Date(),
      paymentMethod: 'BANK_TRANSFER',
    };
  }

  private calculateTax(grossPay: number): number {
    // Simplified progressive tax calculation for Senegal
    // In reality, this would be more complex with tax brackets

    // Tax-free threshold: 630,000 XOF per year (52,500 XOF per month)
    const taxFreeAmount = 52500;

    if (grossPay <= taxFreeAmount) {
      return 0;
    }

    const taxableIncome = grossPay - taxFreeAmount;

    // Progressive tax brackets (simplified)
    let tax = 0;

    if (taxableIncome <= 50000) {
      tax = taxableIncome * 0.0;
    } else if (taxableIncome <= 100000) {
      tax = (taxableIncome - 50000) * 0.10;
    } else if (taxableIncome <= 200000) {
      tax = 50000 * 0.10 + (taxableIncome - 100000) * 0.15;
    } else if (taxableIncome <= 500000) {
      tax = 50000 * 0.10 + 100000 * 0.15 + (taxableIncome - 200000) * 0.20;
    } else {
      tax = 50000 * 0.10 + 100000 * 0.15 + 300000 * 0.20 + (taxableIncome - 500000) * 0.25;
    }

    return tax;
  }

  private groupPayrollByDepartment(payrollData: PayrollCalculation[]): any {
    const grouped = {};

    for (const data of payrollData) {
      if (!grouped[data.department]) {
        grouped[data.department] = {
          department: data.department,
          employeeCount: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
        };
      }

      grouped[data.department].employeeCount++;
      grouped[data.department].totalGrossPay += data.grossPay;
      grouped[data.department].totalNetPay += data.netPay;
    }

    return Object.values(grouped);
  }

  async calculateAnnualLeaveAccrual(employeeId: string): Promise<number> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Calculate months of service
    const hireDate = new Date(employee.hireDate);
    const today = new Date();
    const monthsOfService = (today.getFullYear() - hireDate.getFullYear()) * 12 + (today.getMonth() - hireDate.getMonth());

    // Accrual rate: 2.5 days per month
    const accruedDays = (monthsOfService * 2.5);

    return Math.min(accruedDays, employee.annualLeaveDays);
  }
}
