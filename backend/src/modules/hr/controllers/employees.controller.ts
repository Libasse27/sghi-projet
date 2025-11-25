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
import { EmployeesService } from '../services/employees.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('hr/employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR)
  async create(@Body() createDto: any) {
    return await this.employeesService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findAll(@Query() filters: any) {
    return await this.employeesService.findAll(filters);
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getStatistics() {
    return await this.employeesService.getEmployeeStatistics();
  }

  @Get('department/:department')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getByDepartment(@Param('department') department: string) {
    return await this.employeesService.getEmployeesByDepartment(department);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findOne(@Param('id') id: string) {
    return await this.employeesService.findOne(id);
  }

  @Get('number/:employeeNumber')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async findByEmployeeNumber(@Param('employeeNumber') employeeNumber: string) {
    return await this.employeesService.findByEmployeeNumber(employeeNumber);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.employeesService.update(id, updateDto);
  }

  @Post(':id/terminate')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async terminate(@Param('id') id: string, @Body() terminationData: any) {
    return await this.employeesService.terminate(id, terminationData);
  }

  @Post(':id/suspend')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async suspend(@Param('id') id: string, @Body() data: { reason: string }) {
    return await this.employeesService.suspend(id, data.reason);
  }

  @Post(':id/reactivate')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async reactivate(@Param('id') id: string) {
    return await this.employeesService.reactivate(id);
  }

  @Post(':id/request-leave')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async requestLeave(@Param('id') id: string, @Body() leaveData: any) {
    return await this.employeesService.requestLeave(id, leaveData);
  }

  @Post(':id/return-from-leave')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async returnFromLeave(@Param('id') id: string) {
    return await this.employeesService.returnFromLeave(id);
  }
}
