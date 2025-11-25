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
import { LaboratoryService } from '../services/laboratory.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AnalysisStatus } from '../entities/analysis.entity';

@Controller('laboratory/analyses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalysesController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async create(@Body() createDto: any) {
    return await this.laboratoryService.createAnalysis(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findAll(@Query() filters: any) {
    return await this.laboratoryService.findAllAnalyses(filters);
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async getStatistics(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    const debut = dateDebut ? new Date(dateDebut) : undefined;
    const fin = dateFin ? new Date(dateFin) : undefined;
    return await this.laboratoryService.getStatistics(debut, fin);
  }

  @Get('numero/:numero')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findByNumero(@Param('numero') numero: string) {
    return await this.laboratoryService.findByNumero(numero);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findOne(@Param('id') id: string) {
    return await this.laboratoryService.findOneAnalysis(id);
  }

  @Get(':id/samples')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async getSamples(@Param('id') id: string) {
    return await this.laboratoryService.findSamplesByAnalysis(id);
  }

  @Get(':id/results')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async getResults(@Param('id') id: string) {
    return await this.laboratoryService.findResultsByAnalysis(id);
  }

  @Post(':id/samples')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async createSample(@Param('id') id: string, @Body() createDto: any) {
    return await this.laboratoryService.createSample({
      ...createDto,
      analysisId: id,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.laboratoryService.updateAnalysis(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: AnalysisStatus; userId?: string; userName?: string },
  ) {
    return await this.laboratoryService.updateStatus(id, body.status, body.userId, body.userName);
  }
}
