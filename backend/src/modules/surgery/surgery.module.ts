import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surgery } from './entities/surgery.entity';
import { OperatingRoom } from './entities/operating-room.entity';
import { SurgeryPlanningService } from './services/surgery-planning.service';
import { OperatingRoomService } from './services/operating-room.service';
import { SurgeryController } from './controllers/surgery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Surgery, OperatingRoom])],
  controllers: [SurgeryController],
  providers: [SurgeryPlanningService, OperatingRoomService],
  exports: [SurgeryPlanningService, OperatingRoomService],
})
export class SurgeryModule {}
