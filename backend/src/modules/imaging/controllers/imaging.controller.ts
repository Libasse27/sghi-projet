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
import { ImagingService } from '../services/imaging.service';
import { DicomService } from '../services/dicom.service';
import { PacsService } from '../services/pacs.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ImagingStatus } from '../entities/imaging-exam.entity';

@Controller('imaging')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImagingController {
  constructor(
    private readonly imagingService: ImagingService,
    private readonly dicomService: DicomService,
    private readonly pacsService: PacsService,
  ) {}

  @Post('exams')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createExam(@Body() createDto: any) {
    return await this.imagingService.createExam(createDto);
  }

  @Get('exams')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findAllExams(@Query() filters: any) {
    return await this.imagingService.findAllExams(filters);
  }

  @Get('exams/statistics')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getStatistics(@Query('dateDebut') dateDebut?: string, @Query('dateFin') dateFin?: string) {
    const debut = dateDebut ? new Date(dateDebut) : undefined;
    const fin = dateFin ? new Date(dateFin) : undefined;
    return await this.imagingService.getStatistics(debut, fin);
  }

  @Get('exams/numero/:numero')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findByNumero(@Param('numero') numero: string) {
    return await this.imagingService.findByNumero(numero);
  }

  @Get('exams/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findOneExam(@Param('id') id: string) {
    return await this.imagingService.findOne(id);
  }

  @Get('exams/:id/reports')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async getReports(@Param('id') id: string) {
    return await this.imagingService.findReportsByExam(id);
  }

  @Post('exams/:id/reports')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createReport(@Param('id') id: string, @Body() reportData: any) {
    return await this.imagingService.createReport(id, reportData);
  }

  @Patch('exams/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async updateExam(@Param('id') id: string, @Body() updateDto: any) {
    return await this.imagingService.update(id, updateDto);
  }

  @Patch('exams/:id/status')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ImagingStatus; userId?: string; userName?: string },
  ) {
    return await this.imagingService.updateStatus(id, body.status, body.userId, body.userName);
  }

  @Post('reports/:id/validate')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async validateReport(
    @Param('id') id: string,
    @Body() body: { validatorId: string; validatorName: string },
  ) {
    return await this.imagingService.validateReport(id, body.validatorId, body.validatorName);
  }

  @Post('dicom/generate-metadata')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async generateDicomMetadata(@Body() examData: any) {
    return this.dicomService.generateDicomMetadata(examData);
  }

  @Get('pacs/study/:studyUID')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async getStudyUrl(@Param('studyUID') studyUID: string) {
    const url = await this.pacsService.getStudyUrl(studyUID);
    return { url };
  }
}
