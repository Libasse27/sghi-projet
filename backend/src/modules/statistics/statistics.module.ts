import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { StatisticsService } from './services/statistics.service';
import { KpiService } from './services/kpi.service';
import { ReportingService } from './services/reporting.service';
import { StatisticsController } from './controllers/statistics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [StatisticsController],
  providers: [StatisticsService, KpiService, ReportingService],
  exports: [StatisticsService, KpiService, ReportingService],
})
export class StatisticsModule {}
