import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispensing } from '../entities/dispensing.entity';
import { InventoryService } from './inventory.service';

@Injectable()
export class DispensingService {
  constructor(
    @InjectRepository(Dispensing)
    private dispensingRepository: Repository<Dispensing>,
    private inventoryService: InventoryService,
  ) {}

  async create(createDto: any): Promise<Dispensing> {
    const numeroDispensation = await this.generateDispensingNumber();

    const medicine = await this.inventoryService.findOneMedicine(createDto.medicineId);

    const totalPrice = medicine.unitPrice * createDto.quantity;

    const dispensing = this.dispensingRepository.create({
      ...createDto,
      numeroDispensation,
      medicineName: medicine.name,
      totalPrice,
      dispensingDate: new Date(),
    });

    const saved = await this.dispensingRepository.save(dispensing) as any as Dispensing;

    await this.inventoryService.reduceStock(createDto.medicineId, createDto.quantity);

    return saved;
  }

  async findAll(filters?: any): Promise<Dispensing[]> {
    const query = this.dispensingRepository
      .createQueryBuilder('dispensing')
      .leftJoinAndSelect('dispensing.patient', 'patient')
      .leftJoinAndSelect('dispensing.medicine', 'medicine')
      .leftJoinAndSelect('dispensing.pharmacist', 'pharmacist');

    if (filters?.patientId) {
      query.andWhere('dispensing.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('dispensing.dispensingDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('dispensing.dispensingDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Dispensing> {
    const dispensing = await this.dispensingRepository.findOne({
      where: { id },
      relations: ['patient', 'medicine', 'pharmacist'],
    });

    if (!dispensing) {
      throw new NotFoundException(`Dispensing ${id} not found`);
    }

    return dispensing;
  }

  async findByPrescription(prescriptionId: string): Promise<Dispensing[]> {
    return await this.dispensingRepository.find({
      where: { prescriptionId },
      relations: ['medicine', 'pharmacist'],
      order: { dispensingDate: 'DESC' },
    });
  }

  private async generateDispensingNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `DISP-${year}${month}-`;

    const lastDispensing = await this.dispensingRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastDispensing && lastDispensing.numeroDispensation.startsWith(prefix)) {
      const lastNumber = parseInt(lastDispensing.numeroDispensation.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
