import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceList } from '../entities/price-list.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(PriceList)
    private priceListRepository: Repository<PriceList>,
  ) {}

  async createService(createDto: any): Promise<PriceList> {
    const serviceCode = await this.generateServiceCode(createDto.category);

    const service = this.priceListRepository.create({
      ...createDto,
      serviceCode,
    });

    const saved = await this.priceListRepository.save(service) as any as PriceList;
    return saved;
  }

  async findAllServices(filters?: any): Promise<PriceList[]> {
    const query = this.priceListRepository.createQueryBuilder('service');

    if (filters?.category) {
      query.andWhere('service.category = :category', { category: filters.category });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('service.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      query.andWhere(
        '(LOWER(service.serviceName) LIKE LOWER(:search) OR LOWER(service.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    return await query.orderBy('service.category', 'ASC').addOrderBy('service.serviceName', 'ASC').getMany();
  }

  async findOneService(id: string): Promise<PriceList> {
    return await this.priceListRepository.findOne({ where: { id } });
  }

  async findServiceByCode(serviceCode: string): Promise<PriceList> {
    return await this.priceListRepository.findOne({ where: { serviceCode } });
  }

  async updateService(id: string, updateDto: any): Promise<PriceList> {
    const service = await this.findOneService(id);
    Object.assign(service, updateDto);
    const saved = await this.priceListRepository.save(service) as any as PriceList;
    return saved;
  }

  async calculateServicePrice(serviceCode: string, hasInsurance: boolean = false): Promise<number> {
    const service = await this.findServiceByCode(serviceCode);

    if (!service) {
      return 0;
    }

    const basePrice = hasInsurance && service.insurancePrice ? service.insurancePrice : service.basePrice;
    const taxAmount = basePrice * (service.taxRate / 100);

    return basePrice + taxAmount;
  }

  async getServicesByCategory(category: any): Promise<PriceList[]> {
    return await this.priceListRepository.find({
      where: { category: category as any, isActive: true },
      order: { serviceName: 'ASC' },
    });
  }

  private async generateServiceCode(category: string): Promise<string> {
    const categoryPrefix = this.getCategoryPrefix(category);
    const prefix = `${categoryPrefix}-`;

    const lastService = await this.priceListRepository.findOne({
      where: { serviceCode: prefix },
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastService && lastService.serviceCode.startsWith(prefix)) {
      const parts = lastService.serviceCode.split('-');
      const lastNumber = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  private getCategoryPrefix(category: string): string {
    const prefixes = {
      CONSULTATION: 'CONS',
      SURGERY: 'CHIR',
      HOSPITALIZATION: 'HOSP',
      PHARMACY: 'PHAR',
      LABORATORY: 'LAB',
      IMAGING: 'IMG',
      PHYSIOTHERAPY: 'PHYS',
      EMERGENCY: 'URG',
      DENTAL: 'DENT',
      OTHER: 'OTH',
    };

    return prefixes[category] || 'SRV';
  }
}
