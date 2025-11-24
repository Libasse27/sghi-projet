import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Génère un numéro de rendez-vous unique (RDV-YYYY-XXXX)
   */
  private async generateAppointmentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RDV-${year}-`;

    const lastAppointment = await this.appointmentRepository.findOne({
      where: { numeroRendezVous: Like(`${prefix}%`) },
      order: { numeroRendezVous: 'DESC' },
    });

    let sequence = 1;
    if (lastAppointment) {
      const lastSequence = parseInt(lastAppointment.numeroRendezVous.split('-')[2], 10);
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  /**
   * Vérifier la disponibilité d'un créneau
   */
  private async checkAvailability(
    doctorId: string,
    dateRendezVous: Date,
    dureeEstimee: number,
    excludeId?: string,
  ): Promise<boolean> {
    const startTime = new Date(dateRendezVous);
    const endTime = new Date(startTime.getTime() + dureeEstimee * 60000);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
      })
      .andWhere(
        '(appointment.dateRendezVous < :endTime AND ' +
          'DATEADD(minute, appointment.dureeEstimee, appointment.dateRendezVous) > :startTime)',
        { startTime, endTime },
      );

    if (excludeId) {
      queryBuilder.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const conflictingAppointments = await queryBuilder.getCount();

    return conflictingAppointments === 0;
  }

  /**
   * Créer un nouveau rendez-vous
   */
  async create(createDto: CreateAppointmentDto, createdBy?: string): Promise<Appointment> {
    const dateRendezVous = new Date(createDto.dateRendezVous);

    // Vérifier la disponibilité
    const isAvailable = await this.checkAvailability(
      createDto.doctorId,
      dateRendezVous,
      createDto.dureeEstimee,
    );

    if (!isAvailable) {
      throw new ConflictException('Ce créneau horaire n\'est pas disponible');
    }

    const numeroRendezVous = await this.generateAppointmentNumber();

    const appointment = this.appointmentRepository.create({
      ...createDto,
      numeroRendezVous,
      dateRendezVous,
      createdBy,
    });

    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Trouver tous les rendez-vous avec filtres
   */
  async findAll(filters?: {
    status?: AppointmentStatus;
    patientId?: string;
    doctorId?: string;
    dateDebut?: string;
    dateFin?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Appointment[]; total: number }> {
    const { page = 1, limit = 10, ...otherFilters } = filters || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment');

    if (otherFilters.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: otherFilters.status });
    }

    if (otherFilters.patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', {
        patientId: otherFilters.patientId,
      });
    }

    if (otherFilters.doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', {
        doctorId: otherFilters.doctorId,
      });
    }

    if (otherFilters.dateDebut && otherFilters.dateFin) {
      queryBuilder.andWhere('appointment.dateRendezVous BETWEEN :dateDebut AND :dateFin', {
        dateDebut: new Date(otherFilters.dateDebut),
        dateFin: new Date(otherFilters.dateFin),
      });
    }

    queryBuilder.orderBy('appointment.dateRendezVous', 'ASC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * Trouver un rendez-vous par ID
   */
  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Rendez-vous avec l'ID ${id} non trouvé`);
    }

    return appointment;
  }

  /**
   * Trouver les rendez-vous du jour
   */
  async findToday(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.appointmentRepository.find({
      where: {
        dateRendezVous: Between(today, tomorrow),
      },
      order: { dateRendezVous: 'ASC' },
    });
  }

  /**
   * Trouver les rendez-vous d'un médecin pour une date
   */
  async findByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await this.appointmentRepository.find({
      where: {
        doctorId,
        dateRendezVous: Between(startDate, endDate),
      },
      order: { dateRendezVous: 'ASC' },
    });
  }

  /**
   * Mettre à jour un rendez-vous
   */
  async update(id: string, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Si la date ou durée change, vérifier la disponibilité
    if (updateDto.dateRendezVous || updateDto.dureeEstimee) {
      const newDate = updateDto.dateRendezVous
        ? new Date(updateDto.dateRendezVous)
        : appointment.dateRendezVous;
      const newDuration = updateDto.dureeEstimee ?? appointment.dureeEstimee;

      const isAvailable = await this.checkAvailability(
        updateDto.doctorId ?? appointment.doctorId,
        newDate,
        newDuration,
        id,
      );

      if (!isAvailable) {
        throw new ConflictException('Ce créneau horaire n\'est pas disponible');
      }
    }

    Object.assign(appointment, updateDto);

    if (updateDto.dateRendezVous) {
      appointment.dateRendezVous = new Date(updateDto.dateRendezVous);
    }

    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Changer le statut d'un rendez-vous
   */
  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Confirmer un rendez-vous
   */
  async confirm(id: string): Promise<Appointment> {
    return await this.updateStatus(id, AppointmentStatus.CONFIRMED);
  }

  /**
   * Annuler un rendez-vous
   */
  async cancel(id: string): Promise<Appointment> {
    return await this.updateStatus(id, AppointmentStatus.CANCELLED);
  }

  /**
   * Marquer un rendez-vous comme terminé
   */
  async complete(id: string, consultationId?: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.COMPLETED;
    if (consultationId) {
      appointment.consultationId = consultationId;
    }
    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Marquer un rendez-vous comme absence
   */
  async markAsNoShow(id: string): Promise<Appointment> {
    return await this.updateStatus(id, AppointmentStatus.NO_SHOW);
  }

  /**
   * Envoyer un rappel
   */
  async sendReminder(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.rappelEnvoye = true;
    appointment.dateRappel = new Date();
    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Supprimer un rendez-vous
   */
  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  /**
   * Obtenir les créneaux disponibles pour un médecin
   */
  async getAvailableSlots(
    doctorId: string,
    date: string,
    duration: number = 30,
  ): Promise<Array<{ start: Date; end: Date }>> {
    const workStart = 8; // 8h
    const workEnd = 18; // 18h
    const slots: Array<{ start: Date; end: Date }> = [];

    const targetDate = new Date(date);
    targetDate.setHours(workStart, 0, 0, 0);

    const existingAppointments = await this.findByDoctorAndDate(doctorId, date);

    while (targetDate.getHours() < workEnd) {
      const slotEnd = new Date(targetDate.getTime() + duration * 60000);

      const isAvailable = await this.checkAvailability(doctorId, targetDate, duration);

      if (isAvailable && slotEnd.getHours() <= workEnd) {
        slots.push({
          start: new Date(targetDate),
          end: new Date(slotEnd),
        });
      }

      targetDate.setTime(targetDate.getTime() + duration * 60000);
    }

    return slots;
  }
}
