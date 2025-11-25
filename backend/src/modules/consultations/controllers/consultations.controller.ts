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
import { ConsultationsService } from '../services/consultations.service';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationStatus } from '../entities/consultation.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@shared/constants/roles.constants';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Créer une nouvelle consultation' })
  @ApiResponse({ status: 201, description: 'Consultation créée' })
  async create(@Body() createDto: CreateConsultationDto) {
    return await this.consultationsService.create(createDto);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir la liste des consultations' })
  @ApiResponse({ status: 200, description: 'Liste des consultations' })
  async findAll(
    @Query('status') status?: ConsultationStatus,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.consultationsService.findAll({
      status,
      patientId,
      doctorId,
      dateDebut,
      dateFin,
      page,
      limit,
    });
  }

  @Get('patient/:patientId')
  @Roles(
    UserRole.ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Obtenir les consultations d\'un patient' })
  @ApiResponse({ status: 200, description: 'Consultations du patient' })
  async findByPatient(@Param('patientId') patientId: string) {
    return await this.consultationsService.findByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Obtenir les consultations d\'un médecin' })
  @ApiResponse({ status: 200, description: 'Consultations du médecin' })
  async findByDoctor(@Param('doctorId') doctorId: string, @Query('date') date?: string) {
    return await this.consultationsService.findByDoctor(doctorId, date);
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Obtenir les statistiques des consultations' })
  @ApiResponse({ status: 200, description: 'Statistiques des consultations' })
  async getStatistics(
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return await this.consultationsService.getStatistics({ dateDebut, dateFin, doctorId });
  }

  @Get('number/:numeroConsultation')
  @Roles(
    UserRole.ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Obtenir une consultation par son numéro' })
  @ApiResponse({ status: 200, description: 'Consultation trouvée' })
  @ApiResponse({ status: 404, description: 'Consultation non trouvée' })
  async findByNumber(@Param('numeroConsultation') numeroConsultation: string) {
    return await this.consultationsService.findByNumber(numeroConsultation);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Obtenir une consultation par ID' })
  @ApiResponse({ status: 200, description: 'Consultation trouvée' })
  @ApiResponse({ status: 404, description: 'Consultation non trouvée' })
  async findOne(@Param('id') id: string) {
    return await this.consultationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Mettre à jour une consultation' })
  @ApiResponse({ status: 200, description: 'Consultation mise à jour' })
  @ApiResponse({ status: 404, description: 'Consultation non trouvée' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateConsultationDto) {
    return await this.consultationsService.update(id, updateDto);
  }

  @Post(':id/start')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Commencer une consultation' })
  @ApiResponse({ status: 200, description: 'Consultation commencée' })
  async start(@Param('id') id: string) {
    return await this.consultationsService.start(id);
  }

  @Post(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminer une consultation' })
  @ApiResponse({ status: 200, description: 'Consultation terminée' })
  async complete(@Param('id') id: string) {
    return await this.consultationsService.complete(id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler une consultation' })
  @ApiResponse({ status: 200, description: 'Consultation annulée' })
  async cancel(@Param('id') id: string) {
    return await this.consultationsService.cancel(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une consultation' })
  @ApiResponse({ status: 204, description: 'Consultation supprimée' })
  @ApiResponse({ status: 404, description: 'Consultation non trouvée' })
  async remove(@Param('id') id: string) {
    await this.consultationsService.remove(id);
  }
}
