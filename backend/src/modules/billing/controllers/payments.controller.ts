import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { OrangeMoneyService } from '../services/orange-money.service';
import { WaveService } from '../services/wave.service';
import { InsuranceService } from '../services/insurance.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('billing/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orangeMoneyService: OrangeMoneyService,
    private readonly waveService: WaveService,
    private readonly insuranceService: InsuranceService,
  ) {}

  // Payment endpoints
  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async create(@Body() createDto: any) {
    return await this.paymentService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async findAll(@Query() filters: any) {
    return await this.paymentService.findAll(filters);
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN)
  async getStatistics(@Query() filters: any) {
    return await this.paymentService.getPaymentStatistics(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async findOne(@Param('id') id: string) {
    return await this.paymentService.findOne(id);
  }

  @Post(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async confirm(@Param('id') id: string, @Body() transactionData: any) {
    return await this.paymentService.confirmPayment(id, transactionData);
  }

  @Post(':id/fail')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async fail(@Param('id') id: string, @Body() data: { reason: string }) {
    return await this.paymentService.failPayment(id, data.reason);
  }

  @Post(':id/refund')
  @Roles(UserRole.ADMIN)
  async refund(@Param('id') id: string, @Body() refundData: any) {
    return await this.paymentService.refundPayment(id, refundData);
  }

  // Orange Money endpoints
  @Post('orange-money/initiate')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async initiateOrangeMoneyPayment(@Body() request: any) {
    return await this.orangeMoneyService.initiatePayment(request);
  }

  @Get('orange-money/status/:transactionId')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async checkOrangeMoneyStatus(@Param('transactionId') transactionId: string) {
    return await this.orangeMoneyService.checkPaymentStatus(transactionId);
  }

  @Post('orange-money/refund')
  @Roles(UserRole.ADMIN)
  async refundOrangeMoneyPayment(@Body() data: { transactionId: string; amount: number }) {
    return await this.orangeMoneyService.refundPayment(data.transactionId, data.amount);
  }

  @Post('orange-money/webhook')
  async handleOrangeMoneyWebhook(@Body() webhookData: any) {
    await this.orangeMoneyService.handleWebhook(webhookData);
    return { success: true };
  }

  // Wave endpoints
  @Post('wave/initiate')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async initiateWavePayment(@Body() request: any) {
    return await this.waveService.initiatePayment(request);
  }

  @Post('wave/generate-link')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async generateWavePaymentLink(@Body() request: any) {
    return await this.waveService.generatePaymentLink(request);
  }

  @Get('wave/status/:transactionId')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async checkWaveStatus(@Param('transactionId') transactionId: string) {
    return await this.waveService.checkPaymentStatus(transactionId);
  }

  @Post('wave/refund')
  @Roles(UserRole.ADMIN)
  async refundWavePayment(@Body() data: { transactionId: string; amount: number }) {
    return await this.waveService.refundPayment(data.transactionId, data.amount);
  }

  @Post('wave/webhook')
  async handleWaveWebhook(@Body() webhookData: any) {
    await this.waveService.handleWebhook(webhookData);
    return { success: true };
  }

  // Insurance endpoints
  @Post('insurance/submit-claim')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async submitInsuranceClaim(@Body() claim: any) {
    return await this.insuranceService.submitClaim(claim);
  }

  @Get('insurance/claim-status/:claimId')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async checkClaimStatus(@Param('claimId') claimId: string) {
    return await this.insuranceService.checkClaimStatus(claimId);
  }

  @Post('insurance/verify')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async verifyInsurance(@Body() data: { policyNumber: string; insuranceCompany: string }) {
    const isValid = await this.insuranceService.verifyInsurance(data.policyNumber, data.insuranceCompany);
    return { isValid };
  }

  @Post('insurance/pre-authorization')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  async getPreAuthorization(@Body() request: any) {
    return await this.insuranceService.getPreAuthorization(request);
  }

  @Post('insurance/calculate-coverage')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async calculateCoverage(@Body() data: { invoiceType: string; totalAmount: number; insuranceCompany: string }) {
    const coverage = await this.insuranceService.calculateCoverage(
      data.invoiceType,
      data.totalAmount,
      data.insuranceCompany,
    );
    return { coverage };
  }

  @Get('insurance/companies')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async getSupportedInsuranceCompanies() {
    return await this.insuranceService.getSupportedInsuranceCompanies();
  }

  @Get('insurance/coverage-rates')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  async getCoverageRates() {
    return await this.insuranceService.getCoverageRates();
  }
}
