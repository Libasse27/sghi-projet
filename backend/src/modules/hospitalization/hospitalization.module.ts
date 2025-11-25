import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Bed } from './entities/bed.entity';
import { Admission } from './entities/admission.entity';
import { NursingNote } from './entities/nursing-note.entity';
import { BedsController } from './controllers/beds.controller';
import { AdmissionsController } from './controllers/admissions.controller';
import { BedsService } from './services/beds.service';
import { AdmissionsService } from './services/admissions.service';
import { NursingCareService } from './services/nursing-care.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Bed, Admission, NursingNote])],
  controllers: [BedsController, AdmissionsController],
  providers: [BedsService, AdmissionsService, NursingCareService],
  exports: [BedsService, AdmissionsService, NursingCareService],
})
export class HospitalizationModule {}
