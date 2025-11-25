import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from '../services/statistics.service';
import { KpiService } from '../services/kpi.service';
import { ReportingService } from '../services/reporting.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly kpiService: KpiService,
    private readonly reportingService: ReportingService,
  ) {}

  // Dashboard and general statistics
  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getDashboard(@Query() filters: any) {
    return await this.statisticsService.getDashboardStatistics(filters);
  }

  @Get('patients')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getPatientStatistics(@Query() filters: any) {
    return await this.statisticsService.getPatientStatistics(filters);
  }

  @Get('monthly-trends/:year')
  @Roles(UserRole.ADMIN)
  async getMonthlyTrends(@Param('year') year: string) {
    return await this.statisticsService.getMonthlyTrends(parseInt(year));
  }

  @Get('service-utilization')
  @Roles(UserRole.ADMIN)
  async getServiceUtilization(@Query() filters: any) {
    return await this.statisticsService.getServiceUtilization(filters);
  }

  @Get('revenue')
  @Roles(UserRole.ADMIN)
  async getRevenueStatistics(@Query() filters: any) {
    return await this.statisticsService.getRevenueStatistics(filters);
  }

  @Get('top-diagnoses')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getTopDiagnoses(@Query('limit') limit?: string) {
    return await this.statisticsService.getTopDiagnoses(limit ? parseInt(limit) : 10);
  }

  @Get('occupancy-rate')
  @Roles(UserRole.ADMIN, UserRole.NURSE_CHIEF)
  async getOccupancyRate(@Query() filters: any) {
    return await this.statisticsService.getOccupancyRate(filters);
  }

  @Get('wait-times')
  @Roles(UserRole.ADMIN)
  async getAverageWaitTime(@Query() filters: any) {
    return await this.statisticsService.getAverageWaitTime(filters);
  }

  // KPI endpoints
  @Get('kpi/all')
  @Roles(UserRole.ADMIN)
  async getAllKPIs(@Query() filters: any) {
    return await this.kpiService.getAllKPIs(filters);
  }

  @Get('kpi/hospital')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getHospitalKPIs(@Query() filters: any) {
    return await this.kpiService.getHospitalKPIs(filters);
  }

  @Get('kpi/financial')
  @Roles(UserRole.ADMIN)
  async getFinancialKPIs(@Query() filters: any) {
    return await this.kpiService.getFinancialKPIs(filters);
  }

  @Get('kpi/operational')
  @Roles(UserRole.ADMIN)
  async getOperationalKPIs(@Query() filters: any) {
    return await this.kpiService.getOperationalKPIs(filters);
  }

  @Get('kpi/quality')
  @Roles(UserRole.ADMIN, UserRole.NURSE_CHIEF)
  async getQualityKPIs(@Query() filters: any) {
    return await this.kpiService.getQualityKPIs(filters);
  }

  @Get('kpi/staff')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async getStaffKPIs(@Query() filters: any) {
    return await this.kpiService.getStaffKPIs(filters);
  }

  @Get('kpi/trends/:kpiName')
  @Roles(UserRole.ADMIN)
  async getKPITrends(@Param('kpiName') kpiName: string, @Query('period') period?: string) {
    return await this.kpiService.calculateKPITrends(kpiName, period);
  }

  // Reporting endpoints
  @Post('reports/patient')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async generatePatientReport(@Body() filters: any) {
    return await this.reportingService.generatePatientReport(filters);
  }

  @Post('reports/consultation')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async generateConsultationReport(@Body() filters: any) {
    return await this.reportingService.generateConsultationReport(filters);
  }

  @Post('reports/financial')
  @Roles(UserRole.ADMIN)
  async generateFinancialReport(@Body() filters: any) {
    return await this.reportingService.generateFinancialReport(filters);
  }

  @Post('reports/inventory')
  @Roles(UserRole.ADMIN, UserRole.PHARMACIST)
  async generateInventoryReport(@Body() filters: any) {
    return await this.reportingService.generateInventoryReport(filters);
  }

  @Post('reports/staff')
  @Roles(UserRole.ADMIN, UserRole.HR)
  async generateStaffReport(@Body() filters: any) {
    return await this.reportingService.generateStaffReport(filters);
  }

  @Post('reports/emergency')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async generateEmergencyReport(@Body() filters: any) {
    return await this.reportingService.generateEmergencyReport(filters);
  }

  @Post('reports/laboratory')
  @Roles(UserRole.ADMIN, UserRole.LAB_TECHNICIAN)
  async generateLaboratoryReport(@Body() filters: any) {
    return await this.reportingService.generateLaboratoryReport(filters);
  }

  @Post('reports/custom')
  @Roles(UserRole.ADMIN)
  async generateCustomReport(@Body() reportConfig: any) {
    return await this.reportingService.generateCustomReport(reportConfig);
  }

  @Get('reports')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HR)
  async getAllReports(@Query() filters: any) {
    return await this.reportingService.getAllReports(filters);
  }

  @Get('reports/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HR)
  async getReportStatus(@Param('id') id: string) {
    return await this.reportingService.getReportStatus(id);
  }

  @Delete('reports/:id')
  @Roles(UserRole.ADMIN)
  async deleteReport(@Param('id') id: string) {
    await this.reportingService.deleteReport(id);
    return { success: true };
  }

  @Get('reports/templates/all')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HR)
  async getReportTemplates() {
    return await this.reportingService.getReportTemplates();
  }

  @Post('reports/schedule')
  @Roles(UserRole.ADMIN)
  async scheduleReport(@Body() reportConfig: any) {
    return await this.reportingService.scheduleReport(reportConfig);
  }

  @Post('export')
  @Roles(UserRole.ADMIN)
  async exportData(@Body() data: { dataType: string; filters: any; format: string }) {
    return await this.reportingService.exportData(data.dataType, data.filters, data.format);
  }
}
