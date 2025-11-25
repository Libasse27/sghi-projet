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
import { InvoiceService } from '../services/invoice.service';
import { BillingService } from '../services/billing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('billing/invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly billingService: BillingService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async create(@Body() createDto: any) {
    return await this.invoiceService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async findAll(@Query() filters: any) {
    return await this.invoiceService.findAll(filters);
  }

  @Get('overdue')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async getOverdue() {
    return await this.invoiceService.getOverdueInvoices();
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN)
  async getStatistics(@Query() filters: any) {
    return await this.invoiceService.getInvoiceStatistics(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async findOne(@Param('id') id: string) {
    return await this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return await this.invoiceService.update(id, updateDto);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN)
  async cancel(@Param('id') id: string, @Body() data: { reason: string }) {
    return await this.invoiceService.cancelInvoice(id, data.reason);
  }

  // Price list endpoints
  @Post('services')
  @Roles(UserRole.ADMIN)
  async createService(@Body() createDto: any) {
    return await this.billingService.createService(createDto);
  }

  @Get('services/all')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async findAllServices(@Query() filters: any) {
    return await this.billingService.findAllServices(filters);
  }

  @Get('services/category/:category')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async getServicesByCategory(@Param('category') category: string) {
    return await this.billingService.getServicesByCategory(category);
  }

  @Get('services/:id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async findOneService(@Param('id') id: string) {
    return await this.billingService.findOneService(id);
  }

  @Patch('services/:id')
  @Roles(UserRole.ADMIN)
  async updateService(@Param('id') id: string, @Body() updateDto: any) {
    return await this.billingService.updateService(id, updateDto);
  }

  @Post('services/calculate-price')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async calculatePrice(@Body() data: { serviceCode: string; hasInsurance: boolean }) {
    const price = await this.billingService.calculateServicePrice(data.serviceCode, data.hasInsurance);
    return { price };
  }
}
