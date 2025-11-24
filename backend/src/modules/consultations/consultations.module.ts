import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Appointment } from './entities/appointment.entity';
import { Prescription } from './entities/prescription.entity';
import { Diagnosis } from './entities/diagnosis.entity';
import { ConsultationsController } from './controllers/consultations.controller';
import { AppointmentsController } from './controllers/appointments.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { ConsultationsService } from './services/consultations.service';
import { AppointmentsService } from './services/appointments.service';
import { PrescriptionsService } from './services/prescriptions.service';
import { CalendarService } from './services/calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Appointment, Prescription, Diagnosis]),
  ],
  controllers: [
    ConsultationsController,
    AppointmentsController,
    PrescriptionsController,
  ],
  providers: [
    ConsultationsService,
    AppointmentsService,
    PrescriptionsService,
    CalendarService,
  ],
  exports: [
    ConsultationsService,
    AppointmentsService,
    PrescriptionsService,
    CalendarService,
  ],
})
export class ConsultationsModule {}
