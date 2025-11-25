import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { Stock } from './entities/stock.entity';
import { Dispensing } from './entities/dispensing.entity';
import { MedicinesController } from './controllers/medicines.controller';
import { DispensingController } from './controllers/dispensing.controller';
import { InventoryService } from './services/inventory.service';
import { DispensingService } from './services/dispensing.service';
import { DrugInteractionService } from './services/drug-interaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, Stock, Dispensing])],
  controllers: [MedicinesController, DispensingController],
  providers: [InventoryService, DispensingService, DrugInteractionService],
  exports: [InventoryService, DispensingService, DrugInteractionService],
})
export class PharmacyModule {}
