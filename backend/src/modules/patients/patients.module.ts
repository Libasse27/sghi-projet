import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Allergy } from './entities/allergy.entity';
import { Antecedent } from './entities/antecedent.entity';
import { PatientsController } from './controllers/patients.controller';
import { MedicalRecordsController } from './controllers/medical-records.controller';
import { PatientsService } from './services/patients.service';
import { MedicalRecordsService } from './services/medical-records.service';
import { PatientSearchService } from './services/patient-search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, MedicalRecord, Allergy, Antecedent]),
  ],
  controllers: [PatientsController, MedicalRecordsController],
  providers: [PatientsService, MedicalRecordsService, PatientSearchService],
  exports: [PatientsService, MedicalRecordsService, PatientSearchService],
})
export class PatientsModule {}
