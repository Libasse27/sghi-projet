import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperatingRoom, OperatingRoomStatus } from '../entities/operating-room.entity';

@Injectable()
export class OperatingRoomService {
  constructor(
    @InjectRepository(OperatingRoom)
    private operatingRoomRepository: Repository<OperatingRoom>,
  ) {}

  async create(createDto: any): Promise<OperatingRoom> {
    const numeroSalle = await this.generateRoomNumber();

    const room = this.operatingRoomRepository.create({
      ...createDto,
      numeroSalle,
      status: OperatingRoomStatus.AVAILABLE,
    });

    const saved = await this.operatingRoomRepository.save(room) as any as OperatingRoom;
    return saved;
  }

  async findAll(filters?: any): Promise<OperatingRoom[]> {
    const query = this.operatingRoomRepository.createQueryBuilder('room');

    if (filters?.status) {
      query.andWhere('room.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('room.type = :type', { type: filters.type });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('room.isActive = :isActive', { isActive: filters.isActive });
    }

    return await query.orderBy('room.numeroSalle', 'ASC').getMany();
  }

  async findOne(id: string): Promise<OperatingRoom> {
    const room = await this.operatingRoomRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Operating room ${id} not found`);
    }

    return room;
  }

  async update(id: string, updateDto: any): Promise<OperatingRoom> {
    const room = await this.findOne(id);
    Object.assign(room, updateDto);
    const saved = await this.operatingRoomRepository.save(room) as any as OperatingRoom;
    return saved;
  }

  async getAvailableRooms(): Promise<OperatingRoom[]> {
    return await this.operatingRoomRepository.find({
      where: {
        status: OperatingRoomStatus.AVAILABLE,
        isActive: true,
      },
      order: { numeroSalle: 'ASC' },
    });
  }

  async reserveRoom(id: string): Promise<OperatingRoom> {
    const room = await this.findOne(id);

    if (room.status !== OperatingRoomStatus.AVAILABLE) {
      throw new BadRequestException(`Operating room is not available. Current status: ${room.status}`);
    }

    room.status = OperatingRoomStatus.RESERVED;
    return await this.operatingRoomRepository.save(room) as any as OperatingRoom;
  }

  async occupyRoom(id: string): Promise<OperatingRoom> {
    const room = await this.findOne(id);

    if (room.status !== OperatingRoomStatus.RESERVED && room.status !== OperatingRoomStatus.AVAILABLE) {
      throw new BadRequestException(`Cannot occupy room. Current status: ${room.status}`);
    }

    room.status = OperatingRoomStatus.OCCUPIED;
    return await this.operatingRoomRepository.save(room) as any as OperatingRoom;
  }

  async releaseRoom(id: string): Promise<OperatingRoom> {
    const room = await this.findOne(id);

    room.status = OperatingRoomStatus.CLEANING;
    const saved = await this.operatingRoomRepository.save(room) as any as OperatingRoom;

    // In a real system, this would trigger a cleaning workflow
    // For now, we'll just set it back to available after a delay
    setTimeout(async () => {
      room.status = OperatingRoomStatus.AVAILABLE;
      await this.operatingRoomRepository.save(room);
    }, 30 * 60 * 1000); // 30 minutes cleaning time

    return saved;
  }

  async setMaintenance(id: string, maintenanceDto: any): Promise<OperatingRoom> {
    const room = await this.findOne(id);

    if (room.status === OperatingRoomStatus.OCCUPIED) {
      throw new BadRequestException('Cannot set maintenance while room is occupied');
    }

    room.status = OperatingRoomStatus.MAINTENANCE;
    room.maintenanceNotes = maintenanceDto.notes;
    room.lastMaintenanceDate = new Date();
    room.nextMaintenanceDate = maintenanceDto.nextMaintenanceDate;

    return await this.operatingRoomRepository.save(room) as any as OperatingRoom;
  }

  async completeMaintenance(id: string): Promise<OperatingRoom> {
    const room = await this.findOne(id);

    if (room.status !== OperatingRoomStatus.MAINTENANCE) {
      throw new BadRequestException('Room is not in maintenance');
    }

    room.status = OperatingRoomStatus.AVAILABLE;
    return await this.operatingRoomRepository.save(room) as any as OperatingRoom;
  }

  async getRoomStatistics(): Promise<any> {
    const totalRooms = await this.operatingRoomRepository.count({ where: { isActive: true } });
    const availableRooms = await this.operatingRoomRepository.count({
      where: { status: OperatingRoomStatus.AVAILABLE, isActive: true },
    });
    const occupiedRooms = await this.operatingRoomRepository.count({
      where: { status: OperatingRoomStatus.OCCUPIED },
    });
    const reservedRooms = await this.operatingRoomRepository.count({
      where: { status: OperatingRoomStatus.RESERVED },
    });
    const maintenanceRooms = await this.operatingRoomRepository.count({
      where: { status: OperatingRoomStatus.MAINTENANCE },
    });

    return {
      total: totalRooms,
      available: availableRooms,
      occupied: occupiedRooms,
      reserved: reservedRooms,
      maintenance: maintenanceRooms,
      utilizationRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0,
    };
  }

  private async generateRoomNumber(): Promise<string> {
    const prefix = 'SALLE-';

    const lastRoom = await this.operatingRoomRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastRoom && lastRoom.numeroSalle.startsWith(prefix)) {
      const lastNumber = parseInt(lastRoom.numeroSalle.split('-')[1]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }
}
