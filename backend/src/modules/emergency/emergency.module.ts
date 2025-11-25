import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyCase } from './entities/emergency-case.entity';
import { Triage } from './entities/triage.entity';
import { EmergencyController } from './controllers/emergency.controller';
import { EmergencyService } from './services/emergency.service';
import { TriageService } from './services/triage.service';
import { EmergencyQueueService } from './services/emergency-queue.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyCase, Triage])],
  controllers: [EmergencyController],
  providers: [EmergencyService, TriageService, EmergencyQueueService],
  exports: [EmergencyService, TriageService, EmergencyQueueService],
})
export class EmergencyModule {}
