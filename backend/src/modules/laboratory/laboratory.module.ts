import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entity';
import { Sample } from './entities/sample.entity';
import { Result } from './entities/result.entity';
import { AnalysesController } from './controllers/analyses.controller';
import { ResultsController } from './controllers/results.controller';
import { LaboratoryService } from './services/laboratory.service';
import { HematologyService } from './services/hematology.service';
import { BiochemistryService } from './services/biochemistry.service';
import { BacteriologyService } from './services/bacteriology.service';
import { SerologyService } from './services/serology.service';
import { HormonesService } from './services/hormones.service';
import { BiopsyService } from './services/biopsy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis, Sample, Result])],
  controllers: [AnalysesController, ResultsController],
  providers: [
    LaboratoryService,
    HematologyService,
    BiochemistryService,
    BacteriologyService,
    SerologyService,
    HormonesService,
    BiopsyService,
  ],
  exports: [
    LaboratoryService,
    HematologyService,
    BiochemistryService,
    BacteriologyService,
    SerologyService,
    HormonesService,
    BiopsyService,
  ],
})
export class LaboratoryModule {}
