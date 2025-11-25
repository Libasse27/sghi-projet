import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysioSession } from './entities/physio-session.entity';
import { RehabilitationPlan } from './entities/rehabilitation-plan.entity';
import { PhysioBilling } from './entities/physio-billing.entity';
import { PhysiotherapyController } from './controllers/physiotherapy.controller';
import { PhysiotherapyService } from './services/physiotherapy.service';
import { SessionPlanningService } from './services/session-planning.service';
import { RehabilitationService } from './services/rehabilitation.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhysioSession, RehabilitationPlan, PhysioBilling])],
  controllers: [PhysiotherapyController],
  providers: [PhysiotherapyService, SessionPlanningService, RehabilitationService],
  exports: [PhysiotherapyService, SessionPlanningService, RehabilitationService],
})
export class PhysiotherapyModule {}
