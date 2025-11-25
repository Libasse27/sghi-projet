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
import { EmergencyService } from '../services/emergency.service';
import { TriageService } from '../services/triage.service';
import { EmergencyQueueService } from '../services/emergency-queue.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';
import { EmergencyStatus } from '../entities/emergency-case.entity';

@Controller('emergency')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmergencyController {
  constructor(
    private readonly emergencyService: EmergencyService,
    private readonly triageService: TriageService,
    private readonly queueService: EmergencyQueueService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async create(@Body() createDto: any) {
    return await this.emergencyService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async findAll(@Query() filters: any) {
    return await this.emergencyService.findAll(filters);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async findActive() {
    return await this.emergencyService.findActive();
  }

  @Get('queue')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async getQueue() {
    return await this.queueService.getQueue();
  }

  @Get('queue/statistics')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async getQueueStatistics() {
    return await this.queueService.getQueueStatistics();
  }

  @Get('queue/next')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getNextPatient() {
    return await this.queueService.getNextPatient();
  }

  @Get('queue/overdue')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getOverdueCases() {
    return await this.queueService.getOverdueCases();
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getStatistics(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    const debut = dateDebut ? new Date(dateDebut) : undefined;
    const fin = dateFin ? new Date(dateFin) : undefined;
    return await this.emergencyService.getStatistics(debut, fin);
  }

  @Get('priority/:priority')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async findByPriority(@Param('priority') priority: any) {
    return await this.emergencyService.findByPriority(priority);
  }

  @Get('numero/:numero')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async findByNumero(@Param('numero') numero: string) {
    return await this.emergencyService.findByNumero(numero);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async findOne(@Param('id') id: string) {
    return await this.emergencyService.findOne(id);
  }

  @Get(':id/queue-position')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF, UserRole.RECEPTIONIST)
  async getQueuePosition(@Param('id') id: string) {
    const position = await this.queueService.getQueuePosition(id);
    return { position };
  }

  @Get(':id/triage')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getTriageHistory(@Param('id') id: string) {
    return await this.triageService.findByEmergency(id);
  }

  @Post(':id/triage')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async performTriage(@Param('id') id: string, @Body() triageData: any) {
    return await this.triageService.performTriage(id, triageData);
  }

  @Post('calculate-priority')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async calculatePriority(@Body() data: { vitalSigns: any; symptoms: string }) {
    const priority = await this.triageService.calculatePriority(data.vitalSigns, data.symptoms);
    return { priority };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.emergencyService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async updateStatus(@Param('id') id: string, @Body() body: { status: EmergencyStatus }) {
    return await this.emergencyService.updateStatus(id, body.status);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async assignDoctor(
    @Param('id') id: string,
    @Body() body: { doctorId: string; doctorName: string },
  ) {
    return await this.emergencyService.assignDoctor(id, body.doctorId, body.doctorName);
  }
}
