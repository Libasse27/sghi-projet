import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulingService } from '../services/scheduling.service';
import { PayrollService } from '../services/payroll.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('hr/scheduling')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingController {
  constructor(
    private readonly schedulingService: SchedulingService,
    private readonly payrollService: PayrollService,
  ) {}

  // Schedule endpoints
  @Post('schedules')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async createSchedule(@Body() createDto: any) {
    return await this.schedulingService.createSchedule(createDto);
  }

  @Get('schedules')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findAllSchedules(@Query() filters: any) {
    return await this.schedulingService.findAllSchedules(filters);
  }

  @Get('schedules/today')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getTodaySchedule(@Query('employeeId') employeeId?: string) {
    return await this.schedulingService.getTodaySchedule(employeeId);
  }

  @Get('schedules/week')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getWeekSchedule(@Query('startDate') startDate: string, @Query('employeeId') employeeId?: string) {
    return await this.schedulingService.getWeekSchedule(new Date(startDate), employeeId);
  }

  @Get('schedules/:id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findOneSchedule(@Param('id') id: string) {
    return await this.schedulingService.findOne(id);
  }

  @Patch('schedules/:id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async updateSchedule(@Param('id') id: string, @Body() updateDto: any) {
    return await this.schedulingService.update(id, updateDto);
  }

  @Post('schedules/:id/confirm')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async confirmSchedule(@Param('id') id: string) {
    return await this.schedulingService.confirmSchedule(id);
  }

  @Post('schedules/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async cancelSchedule(@Param('id') id: string, @Body() data: { reason: string }) {
    return await this.schedulingService.cancelSchedule(id, data.reason);
  }

  // Attendance endpoints
  @Post('attendance/check-in')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async checkIn(@Body() attendanceDto: any) {
    return await this.schedulingService.checkIn(attendanceDto);
  }

  @Post('attendance/:id/check-out')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async checkOut(@Param('id') id: string) {
    return await this.schedulingService.checkOut(id);
  }

  @Post('attendance/mark-absent')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async markAbsent(@Body() data: { employeeId: string; date: Date; reason?: string }) {
    return await this.schedulingService.markAbsent(data.employeeId, data.date, data.reason);
  }

  @Get('attendance')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findAllAttendances(@Query() filters: any) {
    return await this.schedulingService.findAllAttendances(filters);
  }

  @Get('attendance/statistics')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getAttendanceStatistics(@Query() filters: any) {
    return await this.schedulingService.getAttendanceStatistics(filters);
  }

  // Payroll endpoints
  @Get('payroll/monthly')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async calculateMonthlyPayroll(@Query('month') month: string, @Query('year') year: string) {
    return await this.payrollService.calculateMonthlyPayroll(parseInt(month), parseInt(year));
  }

  @Get('payroll/summary')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getPayrollSummary(@Query('month') month: string, @Query('year') year: string) {
    return await this.payrollService.getPayrollSummary(parseInt(month), parseInt(year));
  }

  @Get('payroll/employee/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async calculateEmployeePayroll(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.payrollService.calculateEmployeePayrollById(
      employeeId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('payroll/payslip/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async generatePayslip(
    @Param('employeeId') employeeId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return await this.payrollService.generatePayslip(employeeId, parseInt(month), parseInt(year));
  }

  @Get('payroll/leave-accrual/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async calculateLeaveAccrual(@Param('employeeId') employeeId: string) {
    return await this.payrollService.calculateAnnualLeaveAccrual(employeeId);
  }
}
