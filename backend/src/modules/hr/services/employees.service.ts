import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeStatus } from '../entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createDto: any): Promise<Employee> {
    const employeeNumber = await this.generateEmployeeNumber(createDto.department);

    const employee = this.employeeRepository.create({
      ...createDto,
      employeeNumber,
      status: EmployeeStatus.ACTIVE,
      usedLeaveDays: 0,
      usedSickLeaveDays: 0,
    });

    const saved = await this.employeeRepository.save(employee) as any as Employee;
    return saved;
  }

  async findAll(filters?: any): Promise<Employee[]> {
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.supervisor', 'supervisor');

    if (filters?.department) {
      query.andWhere('employee.department = :department', { department: filters.department });
    }

    if (filters?.status) {
      query.andWhere('employee.status = :status', { status: filters.status });
    }

    if (filters?.contractType) {
      query.andWhere('employee.contractType = :contractType', { contractType: filters.contractType });
    }

    if (filters?.search) {
      query.andWhere(
        '(LOWER(employee.firstName) LIKE LOWER(:search) OR LOWER(employee.lastName) LIKE LOWER(:search) OR LOWER(employee.employeeNumber) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    return await query.orderBy('employee.lastName', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user', 'supervisor', 'schedules', 'attendances'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    return employee;
  }

  async findByEmployeeNumber(employeeNumber: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { employeeNumber },
      relations: ['user', 'supervisor'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${employeeNumber} not found`);
    }

    return employee;
  }

  async update(id: string, updateDto: any): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateDto);
    const saved = await this.employeeRepository.save(employee) as any as Employee;
    return saved;
  }

  async terminate(id: string, terminationData: any): Promise<Employee> {
    const employee = await this.findOne(id);

    if (employee.status === EmployeeStatus.TERMINATED) {
      throw new BadRequestException('Employee is already terminated');
    }

    employee.status = EmployeeStatus.TERMINATED;
    employee.terminationDate = terminationData.terminationDate || new Date();
    employee.notes = `${employee.notes || ''}\nTermination reason: ${terminationData.reason}`;

    return await this.employeeRepository.save(employee) as any as Employee;
  }

  async suspend(id: string, reason: string): Promise<Employee> {
    const employee = await this.findOne(id);

    if (employee.status === EmployeeStatus.TERMINATED) {
      throw new BadRequestException('Cannot suspend a terminated employee');
    }

    employee.status = EmployeeStatus.SUSPENDED;
    employee.notes = `${employee.notes || ''}\nSuspension reason: ${reason}`;

    return await this.employeeRepository.save(employee) as any as Employee;
  }

  async reactivate(id: string): Promise<Employee> {
    const employee = await this.findOne(id);

    if (employee.status === EmployeeStatus.TERMINATED) {
      throw new BadRequestException('Cannot reactivate a terminated employee');
    }

    employee.status = EmployeeStatus.ACTIVE;
    return await this.employeeRepository.save(employee) as any as Employee;
  }

  async requestLeave(id: string, leaveData: any): Promise<Employee> {
    const employee = await this.findOne(id);

    const daysRequested = leaveData.days;
    const leaveType = leaveData.type; // 'annual' or 'sick'

    if (leaveType === 'annual') {
      const availableDays = employee.annualLeaveDays - employee.usedLeaveDays;
      if (daysRequested > availableDays) {
        throw new BadRequestException(`Insufficient leave days. Available: ${availableDays} days`);
      }
      employee.usedLeaveDays += daysRequested;
    } else if (leaveType === 'sick') {
      const availableDays = employee.sickLeaveDays - employee.usedSickLeaveDays;
      if (daysRequested > availableDays) {
        throw new BadRequestException(`Insufficient sick leave days. Available: ${availableDays} days`);
      }
      employee.usedSickLeaveDays += daysRequested;
    }

    employee.status = EmployeeStatus.ON_LEAVE;
    return await this.employeeRepository.save(employee) as any as Employee;
  }

  async returnFromLeave(id: string): Promise<Employee> {
    const employee = await this.findOne(id);

    if (employee.status !== EmployeeStatus.ON_LEAVE) {
      throw new BadRequestException('Employee is not on leave');
    }

    employee.status = EmployeeStatus.ACTIVE;
    return await this.employeeRepository.save(employee) as any as Employee;
  }

  async getEmployeesByDepartment(department: any): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { department: department as any, status: EmployeeStatus.ACTIVE },
      relations: ['user'],
      order: { lastName: 'ASC' },
    });
  }

  async getEmployeeStatistics(): Promise<any> {
    const totalEmployees = await this.employeeRepository.count({ where: { status: EmployeeStatus.ACTIVE } });

    const byDepartment = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('employee.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('employee.status = :status', { status: EmployeeStatus.ACTIVE })
      .groupBy('employee.department')
      .getRawMany();

    const byContractType = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('employee.contractType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('employee.status = :status', { status: EmployeeStatus.ACTIVE })
      .groupBy('employee.contractType')
      .getRawMany();

    const onLeave = await this.employeeRepository.count({ where: { status: EmployeeStatus.ON_LEAVE } });
    const suspended = await this.employeeRepository.count({ where: { status: EmployeeStatus.SUSPENDED } });

    return {
      totalEmployees,
      onLeave,
      suspended,
      byDepartment: byDepartment.map((item) => ({
        department: item.department,
        count: parseInt(item.count),
      })),
      byContractType: byContractType.map((item) => ({
        type: item.type,
        count: parseInt(item.count),
      })),
    };
  }

  private async generateEmployeeNumber(department: string): Promise<string> {
    const deptPrefix = this.getDepartmentPrefix(department);
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `EMP-${deptPrefix}${year}-`;

    const lastEmployee = await this.employeeRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastEmployee && lastEmployee.employeeNumber.includes(deptPrefix)) {
      const parts = lastEmployee.employeeNumber.split('-');
      const lastNumber = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  private getDepartmentPrefix(department: string): string {
    const prefixes = {
      ADMINISTRATION: 'ADM',
      MEDICAL: 'MED',
      NURSING: 'NUR',
      PHARMACY: 'PHA',
      LABORATORY: 'LAB',
      RADIOLOGY: 'RAD',
      EMERGENCY: 'EMG',
      SURGERY: 'SUR',
      PHYSIOTHERAPY: 'PHY',
      HR: 'HR',
      IT: 'IT',
      MAINTENANCE: 'MNT',
      SECURITY: 'SEC',
      CLEANING: 'CLN',
    };

    return prefixes[department] || 'GEN';
  }
}
