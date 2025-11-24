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
  PrescriptionsService,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from '../services/prescriptions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@shared/constants/roles.constants';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Créer une nouvelle ordonnance' })
  @ApiResponse({ status: 201, description: 'Ordonnance créée' })
  async create(@Body() createDto: CreatePrescriptionDto) {
    return await this.prescriptionsService.create(createDto);
  }

  @Get('patient/:patientId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.PHARMACIST,
  )
  @ApiOperation({ summary: 'Obtenir les ordonnances d\'un patient' })
  @ApiResponse({ status: 200, description: 'Ordonnances du patient' })
  async findByPatient(@Param('patientId') patientId: string) {
    return await this.prescriptionsService.findByPatient(patientId);
  }

  @Get('patient/:patientId/active')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.PHARMACIST,
  )
  @ApiOperation({ summary: 'Obtenir les ordonnances actives d\'un patient' })
  @ApiResponse({ status: 200, description: 'Ordonnances actives du patient' })
  async findActiveByPatient(@Param('patientId') patientId: string) {
    return await this.prescriptionsService.findActiveByPatient(patientId);
  }

  @Get('consultation/:consultationId')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.PHARMACIST,
  )
  @ApiOperation({ summary: 'Obtenir les ordonnances d\'une consultation' })
  @ApiResponse({ status: 200, description: 'Ordonnances de la consultation' })
  async findByConsultation(@Param('consultationId') consultationId: string) {
    return await this.prescriptionsService.findByConsultation(consultationId);
  }

  @Get('number/:numeroPrescription')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PHARMACIST,
  )
  @ApiOperation({ summary: 'Obtenir une ordonnance par son numéro' })
  @ApiResponse({ status: 200, description: 'Ordonnance trouvée' })
  @ApiResponse({ status: 404, description: 'Ordonnance non trouvée' })
  async findByNumber(@Param('numeroPrescription') numeroPrescription: string) {
    return await this.prescriptionsService.findByNumber(numeroPrescription);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.PHARMACIST,
  )
  @ApiOperation({ summary: 'Obtenir une ordonnance par ID' })
  @ApiResponse({ status: 200, description: 'Ordonnance trouvée' })
  @ApiResponse({ status: 404, description: 'Ordonnance non trouvée' })
  async findOne(@Param('id') id: string) {
    return await this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Mettre à jour une ordonnance' })
  @ApiResponse({ status: 200, description: 'Ordonnance mise à jour' })
  @ApiResponse({ status: 404, description: 'Ordonnance non trouvée' })
  async update(@Param('id') id: string, @Body() updateDto: UpdatePrescriptionDto) {
    return await this.prescriptionsService.update(id, updateDto);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler une ordonnance' })
  @ApiResponse({ status: 200, description: 'Ordonnance annulée' })
  async cancel(@Param('id') id: string) {
    return await this.prescriptionsService.cancel(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une ordonnance' })
  @ApiResponse({ status: 204, description: 'Ordonnance supprimée' })
  @ApiResponse({ status: 404, description: 'Ordonnance non trouvée' })
  async remove(@Param('id') id: string) {
    await this.prescriptionsService.remove(id);
  }
}
