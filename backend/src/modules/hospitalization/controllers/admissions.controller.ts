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
import { AdmissionsService } from '../services/admissions.service';
import { NursingCareService } from '../services/nursing-care.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('hospitalization/admissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdmissionsController {
  constructor(
    private readonly admissionsService: AdmissionsService,
    private readonly nursingCareService: NursingCareService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async create(@Body() createDto: any) {
    return await this.admissionsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async findAll(@Query() filters: any) {
    return await this.admissionsService.findAll(filters);
  }

  @Get('active')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getActive() {
    return await this.admissionsService.getActiveAdmissions();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async findOne(@Param('id') id: string) {
    return await this.admissionsService.findOne(id);
  }

  @Get(':id/nursing-notes')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getNursingNotes(@Param('id') id: string) {
    return await this.nursingCareService.findByAdmission(id);
  }

  @Post(':id/nursing-notes')
  @Roles(UserRole.ADMIN, UserRole.NURSE_CHIEF)
  async createNursingNote(@Param('id') id: string, @Body() noteData: any) {
    return await this.nursingCareService.createNote({
      ...noteData,
      admissionId: id,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.admissionsService.update(id, updateDto);
  }

  @Post(':id/discharge')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async discharge(@Param('id') id: string, @Body() body: { dischargeSummary: string }) {
    return await this.admissionsService.discharge(id, body.dischargeSummary);
  }
}
