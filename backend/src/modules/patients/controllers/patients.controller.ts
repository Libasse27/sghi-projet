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
import { PatientsService } from '../services/patients.service';
import { PatientSearchService } from '../services/patient-search.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { SearchPatientDto } from '../dto/search-patient.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@shared/constants/roles.constants';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly patientSearchService: PatientSearchService,
  ) {}

  @Post()
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Créer un nouveau patient' })
  @ApiResponse({ status: 201, description: 'Patient créé avec succès' })
  @ApiResponse({ status: 409, description: 'Conflit - Patient existe déjà' })
  async create(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientsService.create(createPatientDto);
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
  @ApiOperation({ summary: 'Obtenir la liste des patients' })
  @ApiResponse({ status: 200, description: 'Liste des patients' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.patientsService.findAll(page, limit);
  }

  @Post('search')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rechercher des patients avec filtres' })
  @ApiResponse({ status: 200, description: 'Résultats de la recherche' })
  async search(@Body() searchDto: SearchPatientDto) {
    return await this.patientsService.search(searchDto);
  }

  @Get('search/quick')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Recherche rapide de patients' })
  @ApiResponse({ status: 200, description: 'Résultats de la recherche rapide' })
  async quickSearch(@Query('q') query: string) {
    return await this.patientSearchService.quickSearch(query);
  }

  @Get('search/blood-group/:bloodGroup')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
  )
  @ApiOperation({ summary: 'Rechercher des patients par groupe sanguin' })
  @ApiResponse({ status: 200, description: 'Patients trouvés' })
  async findByBloodGroup(@Param('bloodGroup') bloodGroup: string) {
    return await this.patientSearchService.findByBloodGroup(bloodGroup);
  }

  @Get('search/expired-insurance')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Obtenir les patients avec assurance expirée' })
  @ApiResponse({ status: 200, description: 'Patients avec assurance expirée' })
  async findExpiredInsurance() {
    return await this.patientSearchService.findPatientsWithExpiredInsurance();
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  @ApiOperation({ summary: 'Obtenir les statistiques des patients' })
  @ApiResponse({ status: 200, description: 'Statistiques des patients' })
  async getStatistics() {
    return await this.patientsService.getStatistics();
  }

  @Get('number/:numeroPatient')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir un patient par son numéro' })
  @ApiResponse({ status: 200, description: 'Patient trouvé' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async findByNumber(@Param('numeroPatient') numeroPatient: string) {
    return await this.patientsService.findByNumber(numeroPatient);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Obtenir un patient par ID' })
  @ApiResponse({ status: 200, description: 'Patient trouvé' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({ summary: 'Mettre à jour un patient' })
  @ApiResponse({ status: 200, description: 'Patient mis à jour' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Désactiver un patient' })
  @ApiResponse({ status: 200, description: 'Patient désactivé' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async deactivate(@Param('id') id: string) {
    return await this.patientsService.deactivate(id);
  }

  @Post(':id/reactivate')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réactiver un patient' })
  @ApiResponse({ status: 200, description: 'Patient réactivé' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async reactivate(@Param('id') id: string) {
    return await this.patientsService.reactivate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer définitivement un patient' })
  @ApiResponse({ status: 204, description: 'Patient supprimé' })
  @ApiResponse({ status: 404, description: 'Patient non trouvé' })
  async remove(@Param('id') id: string) {
    await this.patientsService.remove(id);
  }
}
