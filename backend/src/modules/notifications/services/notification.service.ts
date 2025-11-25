import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { PushService } from './push.service';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  ALL = 'ALL',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

interface Notification {
  id: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  message: string;
  priority: NotificationPriority;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: Date;
  createdAt: Date;
  metadata?: any;
}

@Injectable()
export class NotificationService {
  private notifications: Notification[] = [];

  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushService,
  ) {}

  async sendNotification(notificationData: {
    type: NotificationType;
    recipient: string;
    subject?: string;
    message: string;
    priority?: NotificationPriority;
    metadata?: any;
  }): Promise<Notification> {
    const notification: Notification = {
      id: `NOTIF-${Date.now()}`,
      type: notificationData.type,
      recipient: notificationData.recipient,
      subject: notificationData.subject,
      message: notificationData.message,
      priority: notificationData.priority || NotificationPriority.MEDIUM,
      status: 'PENDING',
      createdAt: new Date(),
      metadata: notificationData.metadata,
    };

    this.notifications.push(notification);

    try {
      switch (notification.type) {
        case NotificationType.EMAIL:
          await this.emailService.sendEmail({
            to: notification.recipient,
            subject: notification.subject,
            body: notification.message,
          });
          break;

        case NotificationType.SMS:
          await this.smsService.sendSms({
            to: notification.recipient,
            message: notification.message,
          });
          break;

        case NotificationType.PUSH:
          await this.pushService.sendPushNotification({
            userId: notification.recipient,
            title: notification.subject,
            body: notification.message,
          });
          break;

        case NotificationType.ALL:
          await Promise.all([
            this.emailService.sendEmail({
              to: notification.metadata?.email,
              subject: notification.subject,
              body: notification.message,
            }),
            this.smsService.sendSms({
              to: notification.metadata?.phone,
              message: notification.message,
            }),
            this.pushService.sendPushNotification({
              userId: notification.recipient,
              title: notification.subject,
              body: notification.message,
            }),
          ]);
          break;
      }

      notification.status = 'SENT';
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = 'FAILED';
    }

    return notification;
  }

  async sendAppointmentReminder(appointmentData: any): Promise<Notification> {
    const message = `Rappel: Vous avez un rendez-vous le ${appointmentData.date} à ${appointmentData.time} avec Dr. ${appointmentData.doctorName}.`;

    return await this.sendNotification({
      type: NotificationType.SMS,
      recipient: appointmentData.patientPhone,
      message,
      priority: NotificationPriority.HIGH,
      metadata: appointmentData,
    });
  }

  async sendLabResultNotification(labData: any): Promise<Notification> {
    const message = `Vos résultats de laboratoire pour ${labData.testName} sont disponibles. Veuillez consulter votre médecin.`;

    return await this.sendNotification({
      type: NotificationType.ALL,
      recipient: labData.patientId,
      subject: 'Résultats de laboratoire disponibles',
      message,
      priority: NotificationPriority.MEDIUM,
      metadata: {
        email: labData.patientEmail,
        phone: labData.patientPhone,
      },
    });
  }

  async sendPrescriptionReadyNotification(prescriptionData: any): Promise<Notification> {
    const message = `Votre prescription est prête à être récupérée à la pharmacie. Référence: ${prescriptionData.prescriptionNumber}`;

    return await this.sendNotification({
      type: NotificationType.SMS,
      recipient: prescriptionData.patientPhone,
      message,
      priority: NotificationPriority.MEDIUM,
      metadata: prescriptionData,
    });
  }

  async sendEmergencyAlert(emergencyData: any): Promise<Notification[]> {
    const message = `URGENCE: ${emergencyData.message}. Patient: ${emergencyData.patientName}. Priorité: ${emergencyData.priority}`;

    const notifications: Notification[] = [];

    // Send to all emergency staff
    for (const staffMember of emergencyData.staffMembers) {
      const notification = await this.sendNotification({
        type: NotificationType.PUSH,
        recipient: staffMember.userId,
        subject: 'ALERTE URGENCE',
        message,
        priority: NotificationPriority.URGENT,
        metadata: emergencyData,
      });

      notifications.push(notification);
    }

    return notifications;
  }

  async sendInvoiceNotification(invoiceData: any): Promise<Notification> {
    const message = `Votre facture (${invoiceData.invoiceNumber}) d'un montant de ${invoiceData.amount} XOF est disponible. Date d'échéance: ${invoiceData.dueDate}`;

    return await this.sendNotification({
      type: NotificationType.EMAIL,
      recipient: invoiceData.patientEmail,
      subject: 'Nouvelle facture',
      message,
      priority: NotificationPriority.LOW,
      metadata: invoiceData,
    });
  }

  async sendPaymentConfirmation(paymentData: any): Promise<Notification> {
    const message = `Paiement reçu avec succès. Montant: ${paymentData.amount} XOF. Référence: ${paymentData.paymentNumber}. Merci!`;

    return await this.sendNotification({
      type: NotificationType.SMS,
      recipient: paymentData.patientPhone,
      message,
      priority: NotificationPriority.MEDIUM,
      metadata: paymentData,
    });
  }

  async sendStaffScheduleNotification(scheduleData: any): Promise<Notification> {
    const message = `Votre horaire pour ${scheduleData.date}: ${scheduleData.shiftType} (${scheduleData.startTime} - ${scheduleData.endTime})`;

    return await this.sendNotification({
      type: NotificationType.PUSH,
      recipient: scheduleData.employeeId,
      subject: 'Horaire de travail',
      message,
      priority: NotificationPriority.MEDIUM,
      metadata: scheduleData,
    });
  }

  async sendMedicationRefillReminder(medicationData: any): Promise<Notification> {
    const message = `Rappel: Il est temps de renouveler votre prescription pour ${medicationData.medicationName}. Contactez votre médecin.`;

    return await this.sendNotification({
      type: NotificationType.SMS,
      recipient: medicationData.patientPhone,
      message,
      priority: NotificationPriority.MEDIUM,
      metadata: medicationData,
    });
  }

  async getNotificationHistory(filters?: any): Promise<Notification[]> {
    let notifications = [...this.notifications];

    if (filters?.type) {
      notifications = notifications.filter((n) => n.type === filters.type);
    }

    if (filters?.status) {
      notifications = notifications.filter((n) => n.status === filters.status);
    }

    if (filters?.recipient) {
      notifications = notifications.filter((n) => n.recipient === filters.recipient);
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getNotificationStatistics(): Promise<any> {
    const total = this.notifications.length;
    const sent = this.notifications.filter((n) => n.status === 'SENT').length;
    const failed = this.notifications.filter((n) => n.status === 'FAILED').length;
    const pending = this.notifications.filter((n) => n.status === 'PENDING').length;

    const byType = {
      email: this.notifications.filter((n) => n.type === NotificationType.EMAIL).length,
      sms: this.notifications.filter((n) => n.type === NotificationType.SMS).length,
      push: this.notifications.filter((n) => n.type === NotificationType.PUSH).length,
    };

    return {
      total,
      sent,
      failed,
      pending,
      byType,
      successRate: total > 0 ? ((sent / total) * 100).toFixed(2) : 0,
    };
  }

  async retryFailedNotification(notificationId: string): Promise<Notification> {
    const notification = this.notifications.find((n) => n.id === notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== 'FAILED') {
      throw new Error('Can only retry failed notifications');
    }

    // Retry sending
    return await this.sendNotification({
      type: notification.type,
      recipient: notification.recipient,
      subject: notification.subject,
      message: notification.message,
      priority: notification.priority,
      metadata: notification.metadata,
    });
  }
}
