import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentStatus } from '../entities/appointment.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@shared/constants/roles.constants';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Créer un nouveau rendez-vous' })
  @ApiResponse({ status: 201, description: 'Rendez-vous créé' })
  @ApiResponse({ status: 409, description: 'Créneau non disponible' })
  async create(@Body() createDto: CreateAppointmentDto, @CurrentUser() user: any) {
    return await this.appointmentsService.create(createDto, user?.id);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir la liste des rendez-vous' })
  @ApiResponse({ status: 200, description: 'Liste des rendez-vous' })
  async findAll(
    @Query('status') status?: AppointmentStatus,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.appointmentsService.findAll({
      status,
      patientId,
      doctorId,
      dateDebut,
      dateFin,
      page,
      limit,
    });
  }

  @Get('today')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir les rendez-vous du jour' })
  @ApiResponse({ status: 200, description: 'Rendez-vous du jour' })
  async findToday() {
    return await this.appointmentsService.findToday();
  }

  @Get('available-slots')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir les créneaux disponibles' })
  @ApiResponse({ status: 200, description: 'Créneaux disponibles' })
  async getAvailableSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('duration') duration?: number,
  ) {
    return await this.appointmentsService.getAvailableSlots(
      doctorId,
      date,
      duration ? parseInt(duration.toString(), 10) : 30,
    );
  }

  @Get('doctor/:doctorId/date/:date')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Obtenir les rendez-vous d\'un médecin pour une date' })
  @ApiResponse({ status: 200, description: 'Rendez-vous du médecin' })
  async findByDoctorAndDate(@Param('doctorId') doctorId: string, @Param('date') date: string) {
    return await this.appointmentsService.findByDoctorAndDate(doctorId, date);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir un rendez-vous par ID' })
  @ApiResponse({ status: 200, description: 'Rendez-vous trouvé' })
  @ApiResponse({ status: 404, description: 'Rendez-vous non trouvé' })
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Mettre à jour un rendez-vous' })
  @ApiResponse({ status: 200, description: 'Rendez-vous mis à jour' })
  @ApiResponse({ status: 404, description: 'Rendez-vous non trouvé' })
  @ApiResponse({ status: 409, description: 'Créneau non disponible' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
    return await this.appointmentsService.update(id, updateDto);
  }

  @Post(':id/confirm')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmer un rendez-vous' })
  @ApiResponse({ status: 200, description: 'Rendez-vous confirmé' })
  async confirm(@Param('id') id: string) {
    return await this.appointmentsService.confirm(id);
  }

  @Post(':id/cancel')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler un rendez-vous' })
  @ApiResponse({ status: 200, description: 'Rendez-vous annulé' })
  async cancel(@Param('id') id: string) {
    return await this.appointmentsService.cancel(id);
  }

  @Post(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer un rendez-vous comme terminé' })
  @ApiResponse({ status: 200, description: 'Rendez-vous terminé' })
  async complete(@Param('id') id: string, @Body('consultationId') consultationId?: string) {
    return await this.appointmentsService.complete(id, consultationId);
  }

  @Post(':id/no-show')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer un rendez-vous comme absence' })
  @ApiResponse({ status: 200, description: 'Rendez-vous marqué comme absence' })
  async markAsNoShow(@Param('id') id: string) {
    return await this.appointmentsService.markAsNoShow(id);
  }

  @Post(':id/send-reminder')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer un rappel pour un rendez-vous' })
  @ApiResponse({ status: 200, description: 'Rappel envoyé' })
  async sendReminder(@Param('id') id: string) {
    return await this.appointmentsService.sendReminder(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un rendez-vous' })
  @ApiResponse({ status: 204, description: 'Rendez-vous supprimé' })
  @ApiResponse({ status: 404, description: 'Rendez-vous non trouvé' })
  async remove(@Param('id') id: string) {
    await this.appointmentsService.remove(id);
  }
}
