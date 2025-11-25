import { Injectable } from '@nestjs/common';

interface PushNotificationOptions {
  userId: string | string[];
  title: string;
  body: string;
  data?: any;
  icon?: string;
  badge?: string;
  sound?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface PushResult {
  success: boolean;
  messageId?: string;
  recipients?: number;
  error?: string;
}

@Injectable()
export class PushService {
  // In production, these would come from environment variables
  // Using Firebase Cloud Messaging (FCM) or similar service
  private readonly fcmConfig = {
    serverKey: process.env.FCM_SERVER_KEY,
    senderId: process.env.FCM_SENDER_ID,
  };

  // Store device tokens (in production, this would be in a database)
  private deviceTokens: Map<string, string[]> = new Map();

  async sendPushNotification(options: PushNotificationOptions): Promise<PushResult> {
    try {
      const userIds = Array.isArray(options.userId) ? options.userId : [options.userId];

      // Get device tokens for users
      const tokens: string[] = [];
      for (const userId of userIds) {
        const userTokens = this.deviceTokens.get(userId) || [];
        tokens.push(...userTokens);
      }

      if (tokens.length === 0) {
        throw new Error('No device tokens found for the specified users');
      }

      // In production, this would use FCM or APNS
      console.log('Sending push notification:', {
        tokens: tokens.length,
        title: options.title,
        body: options.body,
        data: options.data,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        return {
          success: true,
          messageId: `PUSH-${Date.now()}`,
          recipients: tokens.length,
        };
      } else {
        throw new Error('Failed to send push notification');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendAppointmentReminder(appointmentData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: appointmentData.patientId,
      title: 'Rappel de rendez-vous',
      body: `Votre rendez-vous avec Dr. ${appointmentData.doctorName} est prévu pour ${appointmentData.date} à ${appointmentData.time}`,
      data: {
        type: 'APPOINTMENT',
        appointmentId: appointmentData.id,
      },
      icon: 'appointment_icon',
      priority: 'high',
    });
  }

  async sendLabResultsNotification(labData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: labData.patientId,
      title: 'Résultats de laboratoire disponibles',
      body: `Vos résultats pour ${labData.testName} sont maintenant disponibles`,
      data: {
        type: 'LAB_RESULT',
        analysisId: labData.analysisId,
      },
      icon: 'lab_icon',
      priority: 'high',
    });
  }

  async sendEmergencyAlert(emergencyData: any): Promise<PushResult> {
    const staffIds = emergencyData.staffMembers.map((staff) => staff.userId);

    return await this.sendPushNotification({
      userId: staffIds,
      title: 'ALERTE URGENCE',
      body: `${emergencyData.message}. Patient: ${emergencyData.patientName}. Priorité: ${emergencyData.priority}`,
      data: {
        type: 'EMERGENCY',
        emergencyId: emergencyData.id,
        priority: emergencyData.priority,
      },
      icon: 'emergency_icon',
      sound: 'emergency_alert',
      priority: 'high',
    });
  }

  async sendMedicationReminder(medicationData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: medicationData.patientId,
      title: 'Rappel de médicament',
      body: `Il est temps de prendre ${medicationData.medicationName} - ${medicationData.dosage}`,
      data: {
        type: 'MEDICATION',
        medicationId: medicationData.id,
      },
      icon: 'medication_icon',
      priority: 'high',
    });
  }

  async sendScheduleUpdate(scheduleData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: scheduleData.employeeId,
      title: 'Mise à jour de l\'horaire',
      body: `Votre horaire a été mis à jour: ${scheduleData.shiftType} le ${scheduleData.date}`,
      data: {
        type: 'SCHEDULE',
        scheduleId: scheduleData.id,
      },
      icon: 'schedule_icon',
      priority: 'normal',
    });
  }

  async sendInvoiceNotification(invoiceData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: invoiceData.patientId,
      title: 'Nouvelle facture',
      body: `Facture ${invoiceData.invoiceNumber}: ${invoiceData.amount} XOF. Échéance: ${invoiceData.dueDate}`,
      data: {
        type: 'INVOICE',
        invoiceId: invoiceData.id,
      },
      icon: 'invoice_icon',
      priority: 'normal',
    });
  }

  async sendPaymentConfirmation(paymentData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: paymentData.patientId,
      title: 'Paiement confirmé',
      body: `Votre paiement de ${paymentData.amount} XOF a été reçu. Référence: ${paymentData.paymentNumber}`,
      data: {
        type: 'PAYMENT',
        paymentId: paymentData.id,
      },
      icon: 'payment_icon',
      priority: 'normal',
    });
  }

  async sendSurgeryReminder(surgeryData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: surgeryData.patientId,
      title: 'Rappel de chirurgie',
      body: `Votre intervention chirurgicale est prévue pour ${surgeryData.scheduledDate}. Salle: ${surgeryData.operatingRoom}`,
      data: {
        type: 'SURGERY',
        surgeryId: surgeryData.id,
      },
      icon: 'surgery_icon',
      priority: 'high',
    });
  }

  async sendSystemAnnouncement(announcementData: any): Promise<PushResult> {
    return await this.sendPushNotification({
      userId: announcementData.recipients,
      title: announcementData.title,
      body: announcementData.message,
      data: {
        type: 'ANNOUNCEMENT',
        announcementId: announcementData.id,
      },
      icon: 'announcement_icon',
      priority: 'low',
    });
  }

  // Device token management
  async registerDeviceToken(userId: string, token: string): Promise<void> {
    const tokens = this.deviceTokens.get(userId) || [];

    // Avoid duplicates
    if (!tokens.includes(token)) {
      tokens.push(token);
      this.deviceTokens.set(userId, tokens);
    }
  }

  async unregisterDeviceToken(userId: string, token: string): Promise<void> {
    const tokens = this.deviceTokens.get(userId) || [];
    const index = tokens.indexOf(token);

    if (index > -1) {
      tokens.splice(index, 1);
      this.deviceTokens.set(userId, tokens);
    }
  }

  async getUserDeviceTokens(userId: string): Promise<string[]> {
    return this.deviceTokens.get(userId) || [];
  }

  async sendToTopic(topic: string, notification: any): Promise<PushResult> {
    try {
      // In production, this would use FCM topic messaging
      console.log('Sending to topic:', topic, notification);

      await new Promise((resolve) => setTimeout(resolve, 400));

      return {
        success: true,
        messageId: `TOPIC-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async subscribeTopic(userId: string, topic: string): Promise<void> {
    // In production, subscribe user's tokens to FCM topic
    console.log(`Subscribing user ${userId} to topic ${topic}`);
  }

  async unsubscribeTopic(userId: string, topic: string): Promise<void> {
    // In production, unsubscribe user's tokens from FCM topic
    console.log(`Unsubscribing user ${userId} from topic ${topic}`);
  }

  async getPushStatistics(filters?: any): Promise<any> {
    // In production, this would query actual push notification records
    return {
      totalSent: 0,
      totalFailed: 0,
      totalDevices: this.deviceTokens.size,
      byType: {},
    };
  }
}
