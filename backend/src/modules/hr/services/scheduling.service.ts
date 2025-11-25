import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Schedule, ScheduleStatus } from '../entities/schedule.entity';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { EmployeesService } from './employees.service';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private employeesService: EmployeesService,
  ) {}

  async createSchedule(createDto: any): Promise<Schedule> {
    const scheduleNumber = await this.generateScheduleNumber();

    // Validate employee exists
    await this.employeesService.findOne(createDto.employeeId);

    // Check for conflicts
    await this.checkScheduleConflicts(createDto.employeeId, createDto.scheduleDate, createDto.shiftType);

    const schedule = this.scheduleRepository.create({
      ...createDto,
      scheduleNumber,
      status: ScheduleStatus.SCHEDULED,
    });

    const saved = await this.scheduleRepository.save(schedule) as any as Schedule;
    return saved;
  }

  async findAllSchedules(filters?: any): Promise<Schedule[]> {
    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.employee', 'employee');

    if (filters?.employeeId) {
      query.andWhere('schedule.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.status) {
      query.andWhere('schedule.status = :status', { status: filters.status });
    }

    if (filters?.shiftType) {
      query.andWhere('schedule.shiftType = :shiftType', { shiftType: filters.shiftType });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('schedule.scheduleDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('schedule.scheduleDate', 'ASC').addOrderBy('schedule.startTime', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateDto: any): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (schedule.status === ScheduleStatus.COMPLETED) {
      throw new BadRequestException('Cannot update a completed schedule');
    }

    // Check conflicts if date or shift changed
    if (updateDto.scheduleDate || updateDto.shiftType) {
      const scheduleDate = updateDto.scheduleDate || schedule.scheduleDate;
      const shiftType = updateDto.shiftType || schedule.shiftType;
      await this.checkScheduleConflicts(schedule.employeeId, scheduleDate, shiftType, id);
    }

    Object.assign(schedule, updateDto);
    const saved = await this.scheduleRepository.save(schedule) as any as Schedule;
    return saved;
  }

  async confirmSchedule(id: string): Promise<Schedule> {
    const schedule = await this.findOne(id);
    schedule.status = ScheduleStatus.CONFIRMED;
    return await this.scheduleRepository.save(schedule) as any as Schedule;
  }

  async cancelSchedule(id: string, reason: string): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (schedule.status === ScheduleStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed schedule');
    }

    schedule.status = ScheduleStatus.CANCELLED;
    schedule.notes = `${schedule.notes || ''}\nCancelled: ${reason}`;
    return await this.scheduleRepository.save(schedule) as any as Schedule;
  }

  async getTodaySchedule(employeeId?: string): Promise<Schedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.employee', 'employee')
      .where('schedule.scheduleDate BETWEEN :today AND :tomorrow', { today, tomorrow })
      .andWhere('schedule.status != :cancelled', { cancelled: ScheduleStatus.CANCELLED });

    if (employeeId) {
      query.andWhere('schedule.employeeId = :employeeId', { employeeId });
    }

    return await query.orderBy('schedule.startTime', 'ASC').getMany();
  }

  async getWeekSchedule(startDate: Date, employeeId?: string): Promise<Schedule[]> {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.employee', 'employee')
      .where('schedule.scheduleDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('schedule.status != :cancelled', { cancelled: ScheduleStatus.CANCELLED });

    if (employeeId) {
      query.andWhere('schedule.employeeId = :employeeId', { employeeId });
    }

    return await query.orderBy('schedule.scheduleDate', 'ASC').addOrderBy('schedule.startTime', 'ASC').getMany();
  }

  // Attendance methods
  async checkIn(attendanceDto: any): Promise<Attendance> {
    const attendanceNumber = await this.generateAttendanceNumber();

    // Find today's schedule for the employee
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = await this.scheduleRepository.findOne({
      where: {
        employeeId: attendanceDto.employeeId,
        scheduleDate: today,
        status: ScheduleStatus.CONFIRMED,
      },
    });

    const checkInTime = new Date();

    // Determine if late
    let isLate = false;
    let lateMinutes = 0;

    if (schedule) {
      const scheduledStart = new Date(`${today.toISOString().split('T')[0]}T${schedule.startTime}`);
      const timeDiff = checkInTime.getTime() - scheduledStart.getTime();
      const minutesDiff = Math.floor(timeDiff / 60000);

      if (minutesDiff > 15) {
        // Grace period of 15 minutes
        isLate = true;
        lateMinutes = minutesDiff;
      }
    }

    const attendance = this.attendanceRepository.create({
      ...attendanceDto,
      attendanceNumber,
      attendanceDate: today,
      checkInTime,
      status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
      isLate,
      lateMinutes,
      scheduleId: schedule?.id,
    });

    const saved = await this.attendanceRepository.save(attendance) as any as Attendance;
    return saved;
  }

  async checkOut(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out');
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;

    // Calculate hours worked
    const timeDiff = checkOutTime.getTime() - attendance.checkInTime.getTime();
    attendance.hoursWorked = parseFloat((timeDiff / 3600000).toFixed(2)); // Convert to hours

    // Check if early departure
    if (attendance.schedule) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scheduledEnd = new Date(`${today.toISOString().split('T')[0]}T${attendance.schedule.endTime}`);
      const timeDiff = scheduledEnd.getTime() - checkOutTime.getTime();
      const minutesDiff = Math.floor(timeDiff / 60000);

      if (minutesDiff > 15) {
        // Grace period of 15 minutes
        attendance.isEarlyDeparture = true;
        attendance.earlyDepartureMinutes = minutesDiff;
      }
    }

    return await this.attendanceRepository.save(attendance) as any as Attendance;
  }

  async markAbsent(employeeId: string, date: Date, reason?: string): Promise<Attendance> {
    const attendanceNumber = await this.generateAttendanceNumber();

    const attendance = this.attendanceRepository.create({
      attendanceNumber,
      employeeId,
      attendanceDate: date,
      status: AttendanceStatus.ABSENT,
      reason,
    });

    const saved = await this.attendanceRepository.save(attendance) as any as Attendance;

    // Update schedule status
    const schedule = await this.scheduleRepository.findOne({
      where: {
        employeeId,
        scheduleDate: date,
      },
    });

    if (schedule) {
      schedule.status = ScheduleStatus.ABSENT;
      await this.scheduleRepository.save(schedule);
    }

    return saved;
  }

  async findAllAttendances(filters?: any): Promise<Attendance[]> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('attendance.schedule', 'schedule');

    if (filters?.employeeId) {
      query.andWhere('attendance.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.status) {
      query.andWhere('attendance.status = :status', { status: filters.status });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('attendance.attendanceDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('attendance.attendanceDate', 'DESC').getMany();
  }

  async getAttendanceStatistics(filters?: any): Promise<any> {
    const query = this.attendanceRepository.createQueryBuilder('attendance');

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('attendance.attendanceDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    const total = await query.getCount();
    const present = await query.clone().andWhere('attendance.status = :status', { status: AttendanceStatus.PRESENT }).getCount();
    const late = await query.clone().andWhere('attendance.status = :status', { status: AttendanceStatus.LATE }).getCount();
    const absent = await query.clone().andWhere('attendance.status = :status', { status: AttendanceStatus.ABSENT }).getCount();
    const onLeave = await query.clone().andWhere('attendance.status IN (:...statuses)', {
      statuses: [AttendanceStatus.ON_LEAVE, AttendanceStatus.SICK_LEAVE],
    }).getCount();

    return {
      total,
      present,
      late,
      absent,
      onLeave,
      attendanceRate: total > 0 ? (((present + late) / total) * 100).toFixed(2) : 0,
    };
  }

  private async checkScheduleConflicts(
    employeeId: string,
    scheduleDate: Date,
    shiftType: string,
    excludeScheduleId?: string,
  ): Promise<void> {
    const query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.employeeId = :employeeId', { employeeId })
      .andWhere('schedule.scheduleDate = :scheduleDate', { scheduleDate })
      .andWhere('schedule.status != :cancelled', { cancelled: ScheduleStatus.CANCELLED });

    if (excludeScheduleId) {
      query.andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId });
    }

    const conflicts = await query.getMany();

    if (conflicts.length > 0) {
      throw new BadRequestException('Employee already has a schedule for this date');
    }
  }

  private async generateScheduleNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `SCH-${year}${month}-`;

    const lastSchedule = await this.scheduleRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastSchedule && lastSchedule.scheduleNumber.startsWith(prefix)) {
      const lastNumber = parseInt(lastSchedule.scheduleNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }

  private async generateAttendanceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `ATT-${year}${month}-`;

    const lastAttendance = await this.attendanceRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastAttendance && lastAttendance.attendanceNumber.startsWith(prefix)) {
      const lastNumber = parseInt(lastAttendance.attendanceNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
