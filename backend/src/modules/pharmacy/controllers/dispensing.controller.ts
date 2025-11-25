import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DispensingService } from '../services/dispensing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('pharmacy/dispensing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DispensingController {
  constructor(private readonly dispensingService: DispensingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async create(@Body() createDto: any) {
    return await this.dispensingService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST, UserRole.DOCTOR)
  async findAll(@Query() filters: any) {
    return await this.dispensingService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST, UserRole.DOCTOR)
  async findOne(@Param('id') id: string) {
    return await this.dispensingService.findOne(id);
  }

  @Get('prescription/:prescriptionId')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST, UserRole.DOCTOR)
  async findByPrescription(@Param('prescriptionId') prescriptionId: string) {
    return await this.dispensingService.findByPrescription(prescriptionId);
  }
}
