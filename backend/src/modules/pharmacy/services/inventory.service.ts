import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Medicine } from '../entities/medicine.entity';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async createMedicine(createDto: any): Promise<Medicine> {
    const medicine = this.medicineRepository.create(createDto);
    const saved = await this.medicineRepository.save(medicine);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAllMedicines(filters?: any): Promise<Medicine[]> {
    const query = this.medicineRepository
      .createQueryBuilder('medicine')
      .leftJoinAndSelect('medicine.stocks', 'stocks');

    if (filters?.category) {
      query.andWhere('medicine.category = :category', { category: filters.category });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('medicine.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      query.andWhere('(LOWER(medicine.name) LIKE LOWER(:search) OR LOWER(medicine.genericName) LIKE LOWER(:search))', {
        search: `%${filters.search}%`,
      });
    }

    return await query.getMany();
  }

  async findOneMedicine(id: string): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
      relations: ['stocks'],
    });

    if (!medicine) {
      throw new NotFoundException(`Medicine ${id} not found`);
    }

    return medicine;
  }

  async updateMedicine(id: string, updateDto: any): Promise<Medicine> {
    const medicine = await this.findOneMedicine(id);
    Object.assign(medicine, updateDto);
    const saved = await this.medicineRepository.save(medicine);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async addStock(createDto: any): Promise<Stock> {
    const medicine = await this.findOneMedicine(createDto.medicineId);

    const stock = this.stockRepository.create({
      ...createDto,
      receivedDate: new Date(),
    });

    const saved = await this.stockRepository.save(stock);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findStockByMedicine(medicineId: string): Promise<Stock[]> {
    return await this.stockRepository.find({
      where: { medicineId, isActive: true },
      order: { expirationDate: 'ASC' },
    });
  }

  async getTotalStock(medicineId: string): Promise<number> {
    const stocks = await this.findStockByMedicine(medicineId);
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  async getLowStockItems(): Promise<any[]> {
    const medicines = await this.medicineRepository.find({
      relations: ['stocks'],
      where: { isActive: true },
    });

    const lowStock = [];

    for (const medicine of medicines) {
      const totalStock = await this.getTotalStock(medicine.id);
      const minStock = medicine.stocks[0]?.minimumStock || 0;

      if (totalStock <= minStock) {
        lowStock.push({
          medicine,
          currentStock: totalStock,
          minimumStock: minStock,
        });
      }
    }

    return lowStock;
  }

  async getExpiringSoon(days: number = 30): Promise<Stock[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    return await this.stockRepository.find({
      where: {
        expirationDate: LessThan(expirationDate),
        isActive: true,
      },
      relations: ['medicine'],
      order: { expirationDate: 'ASC' },
    });
  }

  async reduceStock(medicineId: string, quantity: number): Promise<void> {
    const stocks = await this.findStockByMedicine(medicineId);

    if (stocks.length === 0) {
      throw new BadRequestException('No stock available for this medicine');
    }

    const totalAvailable = stocks.reduce((sum, s) => sum + s.quantity, 0);

    if (totalAvailable < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    let remainingQuantity = quantity;

    for (const stock of stocks) {
      if (remainingQuantity === 0) break;

      if (stock.quantity >= remainingQuantity) {
        stock.quantity -= remainingQuantity;
        remainingQuantity = 0;
      } else {
        remainingQuantity -= stock.quantity;
        stock.quantity = 0;
        stock.isActive = false;
      }

      await this.stockRepository.save(stock);
    }
  }
}
