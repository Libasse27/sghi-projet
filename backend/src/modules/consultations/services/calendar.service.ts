import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Consultation } from '../entities/consultation.entity';
import { Appointment } from '../entities/appointment.entity';

export interface CalendarEvent {
  id: string;
  type: 'consultation' | 'appointment';
  title: string;
  start: Date;
  end: Date;
  patientNom: string;
  doctorName: string;
  status: string;
  salle?: string;
  color?: string;
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Obtenir tous les événements (consultations + rendez-vous) pour une période
   */
  async getEvents(startDate: string, endDate: string, doctorId?: string): Promise<CalendarEvent[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [consultations, appointments] = await Promise.all([
      this.getConsultations(start, end, doctorId),
      this.getAppointments(start, end, doctorId),
    ]);

    const events: CalendarEvent[] = [];

    // Convertir les consultations en événements
    consultations.forEach((consultation) => {
      events.push({
        id: consultation.id,
        type: 'consultation',
        title: `Consultation - ${consultation.patientNom}`,
        start: consultation.dateConsultation,
        end: new Date(consultation.dateConsultation.getTime() + 30 * 60000), // +30 min par défaut
        patientNom: consultation.patientNom,
        doctorName: consultation.doctorName,
        status: consultation.status,
        salle: consultation.salle,
        color: this.getColorByStatus(consultation.status),
      });
    });

    // Convertir les rendez-vous en événements
    appointments.forEach((appointment) => {
      events.push({
        id: appointment.id,
        type: 'appointment',
        title: `RDV - ${appointment.patientNom}`,
        start: appointment.dateRendezVous,
        end: new Date(appointment.dateRendezVous.getTime() + appointment.dureeEstimee * 60000),
        patientNom: appointment.patientNom,
        doctorName: appointment.doctorName,
        status: appointment.status,
        salle: appointment.salle,
        color: this.getColorByStatus(appointment.status),
      });
    });

    // Trier par date
    events.sort((a, b) => a.start.getTime() - b.start.getTime());

    return events;
  }

  /**
   * Obtenir les consultations pour une période
   */
  private async getConsultations(
    start: Date,
    end: Date,
    doctorId?: string,
  ): Promise<Consultation[]> {
    const queryBuilder = this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.dateConsultation BETWEEN :start AND :end', { start, end });

    if (doctorId) {
      queryBuilder.andWhere('consultation.doctorId = :doctorId', { doctorId });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Obtenir les rendez-vous pour une période
   */
  private async getAppointments(start: Date, end: Date, doctorId?: string): Promise<Appointment[]> {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.dateRendezVous BETWEEN :start AND :end', { start, end });

    if (doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Obtenir les événements d'un jour spécifique
   */
  async getDayEvents(date: string, doctorId?: string): Promise<CalendarEvent[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.getEvents(startOfDay.toISOString(), endOfDay.toISOString(), doctorId);
  }

  /**
   * Obtenir les événements d'une semaine
   */
  async getWeekEvents(startDate: string, doctorId?: string): Promise<CalendarEvent[]> {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return await this.getEvents(start.toISOString(), end.toISOString(), doctorId);
  }

  /**
   * Obtenir les événements d'un mois
   */
  async getMonthEvents(year: number, month: number, doctorId?: string): Promise<CalendarEvent[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.getEvents(start.toISOString(), end.toISOString(), doctorId);
  }

  /**
   * Obtenir la couleur en fonction du statut
   */
  private getColorByStatus(status: string): string {
    const colors: Record<string, string> = {
      Planifiée: '#1890ff',
      Planifié: '#1890ff',
      Confirmé: '#52c41a',
      'En cours': '#faad14',
      Terminée: '#52c41a',
      Terminé: '#52c41a',
      Annulée: '#f5222d',
      Annulé: '#f5222d',
      Absent: '#d9d9d9',
    };

    return colors[status] || '#1890ff';
  }

  /**
   * Obtenir les statistiques du calendrier
   */
  async getCalendarStats(
    startDate: string,
    endDate: string,
    doctorId?: string,
  ): Promise<{
    totalConsultations: number;
    totalAppointments: number;
    totalEvents: number;
    byDay: Record<string, number>;
  }> {
    const events = await this.getEvents(startDate, endDate, doctorId);

    const totalConsultations = events.filter((e) => e.type === 'consultation').length;
    const totalAppointments = events.filter((e) => e.type === 'appointment').length;

    const byDay = events.reduce((acc, event) => {
      const day = event.start.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConsultations,
      totalAppointments,
      totalEvents: events.length,
      byDay,
    };
  }
}
