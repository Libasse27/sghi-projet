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
import { BedsService } from '../services/beds.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';
import { BedStatus } from '../entities/bed.entity';

@Controller('hospitalization/beds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createDto: any) {
    return await this.bedsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async findAll(@Query() filters: any) {
    return await this.bedsService.findAll(filters);
  }

  @Get('available')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async getAvailable() {
    return await this.bedsService.getAvailableBeds();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_CHIEF)
  async findOne(@Param('id') id: string) {
    return await this.bedsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.NURSE_CHIEF)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.bedsService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.NURSE_CHIEF)
  async updateStatus(@Param('id') id: string, @Body() body: { status: BedStatus }) {
    return await this.bedsService.updateStatus(id, body.status);
  }
}
