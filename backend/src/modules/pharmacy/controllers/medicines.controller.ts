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
import { InventoryService } from '../services/inventory.service';
import { DrugInteractionService } from '../services/drug-interaction.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('pharmacy/medicines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicinesController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly drugInteractionService: DrugInteractionService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async create(@Body() createDto: any) {
    return await this.inventoryService.createMedicine(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST)
  async findAll(@Query() filters: any) {
    return await this.inventoryService.findAllMedicines(filters);
  }

  @Get('low-stock')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async getLowStock() {
    return await this.inventoryService.getLowStockItems();
  }

  @Get('expiring-soon')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async getExpiringSoon(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    return await this.inventoryService.getExpiringSoon(daysNumber);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST)
  async findOne(@Param('id') id: string) {
    return await this.inventoryService.findOneMedicine(id);
  }

  @Get(':id/stock')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async getStock(@Param('id') id: string) {
    const stocks = await this.inventoryService.findStockByMedicine(id);
    const totalStock = await this.inventoryService.getTotalStock(id);
    return { stocks, totalStock };
  }

  @Post(':id/stock')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async addStock(@Param('id') id: string, @Body() stockDto: any) {
    return await this.inventoryService.addStock({
      ...stockDto,
      medicineId: id,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.inventoryService.updateMedicine(id, updateDto);
  }

  @Post('check-interactions')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST)
  async checkInteractions(@Body() data: { medicineNames: string[] }) {
    const interactions = this.drugInteractionService.checkInteractions(data.medicineNames);
    return { interactions };
  }
}
