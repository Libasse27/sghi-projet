import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Schedule } from './entities/schedule.entity';
import { Attendance } from './entities/attendance.entity';
import { EmployeesService } from './services/employees.service';
import { SchedulingService } from './services/scheduling.service';
import { PayrollService } from './services/payroll.service';
import { EmployeesController } from './controllers/employees.controller';
import { SchedulingController } from './controllers/scheduling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Schedule, Attendance])],
  controllers: [EmployeesController, SchedulingController],
  providers: [EmployeesService, SchedulingService, PayrollService],
  exports: [EmployeesService, SchedulingService, PayrollService],
})
export class HrModule {}
