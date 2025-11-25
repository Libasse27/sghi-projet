import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagingExam } from './entities/imaging-exam.entity';
import { ImagingReport } from './entities/imaging-report.entity';
import { ImagingController } from './controllers/imaging.controller';
import { ImagingService } from './services/imaging.service';
import { DicomService } from './services/dicom.service';
import { PacsService } from './services/pacs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImagingExam, ImagingReport])],
  controllers: [ImagingController],
  providers: [ImagingService, DicomService, PacsService],
  exports: [ImagingService, DicomService, PacsService],
})
export class ImagingModule {}
