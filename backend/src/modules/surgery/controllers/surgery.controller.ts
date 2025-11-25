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
import { SurgeryPlanningService } from '../services/surgery-planning.service';
import { OperatingRoomService } from '../services/operating-room.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('surgery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurgeryController {
  constructor(
    private readonly surgeryPlanningService: SurgeryPlanningService,
    private readonly operatingRoomService: OperatingRoomService,
  ) {}

  // Surgery endpoints
  @Post('surgeries')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createSurgery(@Body() createDto: any) {
    return await this.surgeryPlanningService.create(createDto);
  }

  @Get('surgeries')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findAllSurgeries(@Query() filters: any) {
    return await this.surgeryPlanningService.findAll(filters);
  }

  @Get('surgeries/today')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getTodaySchedule() {
    return await this.surgeryPlanningService.getTodaySchedule();
  }

  @Get('surgeries/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findOneSurgery(@Param('id') id: string) {
    return await this.surgeryPlanningService.findOne(id);
  }

  @Patch('surgeries/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateSurgery(@Param('id') id: string, @Body() updateDto: any) {
    return await this.surgeryPlanningService.update(id, updateDto);
  }

  @Post('surgeries/:id/start')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async startSurgery(@Param('id') id: string) {
    return await this.surgeryPlanningService.startSurgery(id);
  }

  @Post('surgeries/:id/complete')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async completeSurgery(@Param('id') id: string, @Body() completionDto: any) {
    return await this.surgeryPlanningService.completeSurgery(id, completionDto);
  }

  @Post('surgeries/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async cancelSurgery(@Param('id') id: string, @Body() data: { reason: string }) {
    return await this.surgeryPlanningService.cancelSurgery(id, data.reason);
  }

  // Operating room endpoints
  @Post('operating-rooms')
  @Roles(UserRole.ADMIN)
  async createOperatingRoom(@Body() createDto: any) {
    return await this.operatingRoomService.create(createDto);
  }

  @Get('operating-rooms')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findAllOperatingRooms(@Query() filters: any) {
    return await this.operatingRoomService.findAll(filters);
  }

  @Get('operating-rooms/available')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getAvailableRooms() {
    return await this.operatingRoomService.getAvailableRooms();
  }

  @Get('operating-rooms/statistics')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getRoomStatistics() {
    return await this.operatingRoomService.getRoomStatistics();
  }

  @Get('operating-rooms/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async findOneOperatingRoom(@Param('id') id: string) {
    return await this.operatingRoomService.findOne(id);
  }

  @Patch('operating-rooms/:id')
  @Roles(UserRole.ADMIN)
  async updateOperatingRoom(@Param('id') id: string, @Body() updateDto: any) {
    return await this.operatingRoomService.update(id, updateDto);
  }

  @Post('operating-rooms/:id/reserve')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async reserveRoom(@Param('id') id: string) {
    return await this.operatingRoomService.reserveRoom(id);
  }

  @Post('operating-rooms/:id/occupy')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async occupyRoom(@Param('id') id: string) {
    return await this.operatingRoomService.occupyRoom(id);
  }

  @Post('operating-rooms/:id/release')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async releaseRoom(@Param('id') id: string) {
    return await this.operatingRoomService.releaseRoom(id);
  }

  @Post('operating-rooms/:id/maintenance')
  @Roles(UserRole.ADMIN)
  async setMaintenance(@Param('id') id: string, @Body() maintenanceDto: any) {
    return await this.operatingRoomService.setMaintenance(id, maintenanceDto);
  }

  @Post('operating-rooms/:id/maintenance/complete')
  @Roles(UserRole.ADMIN)
  async completeMaintenance(@Param('id') id: string) {
    return await this.operatingRoomService.completeMaintenance(id);
  }
}
