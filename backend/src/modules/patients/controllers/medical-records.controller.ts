import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  MedicalRecordsService,
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from '../services/medical-records.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@shared/constants/roles.constants';

@ApiTags('Medical Records')
@ApiBearerAuth()
@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Créer un nouveau dossier médical' })
  @ApiResponse({ status: 201, description: 'Dossier médical créé' })
  async create(@Body() createDto: CreateMedicalRecordDto) {
    return await this.medicalRecordsService.create(createDto);
  }

  @Get('patient/:patientId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Obtenir tous les dossiers médicaux d\'un patient' })
  @ApiResponse({ status: 200, description: 'Dossiers médicaux du patient' })
  async findByPatient(@Param('patientId') patientId: string) {
    return await this.medicalRecordsService.findByPatient(patientId);
  }

  @Get('patient/:patientId/statistics')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Obtenir les statistiques des dossiers médicaux d\'un patient' })
  @ApiResponse({ status: 200, description: 'Statistiques des dossiers médicaux' })
  async getPatientStatistics(@Param('patientId') patientId: string) {
    return await this.medicalRecordsService.getPatientStatistics(patientId);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Obtenir un dossier médical par ID' })
  @ApiResponse({ status: 200, description: 'Dossier médical trouvé' })
  @ApiResponse({ status: 404, description: 'Dossier médical non trouvé' })
  async findOne(@Param('id') id: string) {
    return await this.medicalRecordsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Mettre à jour un dossier médical' })
  @ApiResponse({ status: 200, description: 'Dossier médical mis à jour' })
  @ApiResponse({ status: 404, description: 'Dossier médical non trouvé' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMedicalRecordDto) {
    return await this.medicalRecordsService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Changer le statut d\'un dossier médical' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.medicalRecordsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un dossier médical' })
  @ApiResponse({ status: 204, description: 'Dossier médical supprimé' })
  @ApiResponse({ status: 404, description: 'Dossier médical non trouvé' })
  async remove(@Param('id') id: string) {
    await this.medicalRecordsService.remove(id);
  }
}
