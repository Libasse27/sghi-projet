import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bed, BedStatus } from '../entities/bed.entity';
import { Room } from '../entities/room.entity';

@Injectable()
export class BedsService {
  constructor(
    @InjectRepository(Bed)
    private bedRepository: Repository<Bed>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createDto: any): Promise<Bed> {
    const numeroLit = await this.generateBedNumber();
    const bed = this.bedRepository.create({ ...createDto, numeroLit });
    const saved = await this.bedRepository.save(bed);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findAll(filters?: any): Promise<Bed[]> {
    const query = this.bedRepository
      .createQueryBuilder('bed')
      .leftJoinAndSelect('bed.room', 'room');

    if (filters?.status) {
      query.andWhere('bed.status = :status', { status: filters.status });
    }

    if (filters?.roomId) {
      query.andWhere('bed.roomId = :roomId', { roomId: filters.roomId });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Bed> {
    const bed = await this.bedRepository.findOne({
      where: { id },
      relations: ['room', 'admissions'],
    });

    if (!bed) {
      throw new NotFoundException(`Bed ${id} not found`);
    }

    return bed;
  }

  async update(id: string, updateDto: any): Promise<Bed> {
    const bed = await this.findOne(id);
    Object.assign(bed, updateDto);
    const saved = await this.bedRepository.save(bed);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async updateStatus(id: string, status: BedStatus): Promise<Bed> {
    const bed = await this.findOne(id);
    bed.status = status;
    const saved = await this.bedRepository.save(bed);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getAvailableBeds(): Promise<Bed[]> {
    return await this.bedRepository.find({
      where: { status: BedStatus.AVAILABLE, isActive: true },
      relations: ['room'],
    });
  }

  private async generateBedNumber(): Promise<string> {
    const lastBed = await this.bedRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastBed) {
      const lastNumber = parseInt(lastBed.numeroLit.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    return `LIT-${nextNumber.toString().padStart(4, '0')}`;
  }
}
