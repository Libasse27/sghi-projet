import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { Emergency } from './entities/emergency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emergency])],
  controllers: [EmergencyController],
  providers: [EmergencyService],
  exports: [EmergencyService],
})
export class EmergencyModule {}
