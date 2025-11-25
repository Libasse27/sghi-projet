import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LaboratoryService } from '../services/laboratory.service';
import { HematologyService } from '../services/hematology.service';
import { BiochemistryService } from '../services/biochemistry.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('laboratory/results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(
    private readonly laboratoryService: LaboratoryService,
    private readonly hematologyService: HematologyService,
    private readonly biochemistryService: BiochemistryService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async create(@Body() createDto: any) {
    return await this.laboratoryService.createResult(createDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async findOne(@Param('id') id: string) {
    return await this.laboratoryService.findResultsByAnalysis(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.laboratoryService.updateResult(id, updateDto);
  }

  @Post(':id/validate')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async validate(
    @Param('id') id: string,
    @Body() body: { validatorId: string; validatorName: string },
  ) {
    return await this.laboratoryService.validateResult(id, body.validatorId, body.validatorName);
  }

  @Post('interpret/hematology')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretHematology(@Body() data: { testCode: string; value: number; patientSex: 'M' | 'F' }) {
    return this.hematologyService.analyzeHematologyResults(data.testCode, data.value, data.patientSex);
  }

  @Post('interpret/biochemistry')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretBiochemistry(@Body() data: { testCode: string; value: number; patientSex: 'M' | 'F' }) {
    return this.biochemistryService.analyzeResult(data.testCode, data.value, data.patientSex);
  }

  @Post('interpret/cbc')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretCBC(@Body() data: { results: any; patientSex: 'M' | 'F' }) {
    const interpretation = this.hematologyService.interpretCBC(data.results, data.patientSex);
    return { interpretation };
  }

  @Post('interpret/liver')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretLiver(@Body() data: { results: any }) {
    const interpretation = this.biochemistryService.interpretLiverFunction(data.results);
    return { interpretation };
  }

  @Post('interpret/renal')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretRenal(@Body() data: { results: any; patientSex: 'M' | 'F' }) {
    const interpretation = this.biochemistryService.interpretRenalFunction(data.results, data.patientSex);
    return { interpretation };
  }

  @Post('interpret/lipid')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  async interpretLipid(@Body() data: { results: any }) {
    const interpretation = this.biochemistryService.interpretLipidProfile(data.results);
    return { interpretation };
  }
}
