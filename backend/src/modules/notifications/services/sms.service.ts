import { Injectable } from '@nestjs/common';

interface SmsOptions {
  to: string;
  message: string;
  sender?: string;
}

interface SmsResult {
  success: boolean;
  messageId?: string;
  cost?: number;
  error?: string;
}

@Injectable()
export class SmsService {
  // In production, these would come from environment variables
  // Common SMS providers in Senegal: Orange API, Free Mobile, etc.
  private readonly smsConfig = {
    apiUrl: process.env.SMS_API_URL || 'https://api.sms-provider.sn/v1',
    apiKey: process.env.SMS_API_KEY,
    sender: process.env.SMS_SENDER || 'HOSPITAL',
  };

  async sendSms(options: SmsOptions): Promise<SmsResult> {
    try {
      // Validate phone number format (Senegal)
      if (!this.validatePhoneNumber(options.to)) {
        throw new Error('Invalid phone number format');
      }

      // In production, this would make an actual API call to SMS provider
      console.log('Sending SMS:', {
        to: options.to,
        message: options.message,
        sender: options.sender || this.smsConfig.sender,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Simulate 95% success rate
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        return {
          success: true,
          messageId: `SMS-${Date.now()}`,
          cost: this.calculateSmsCost(options.message),
        };
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendAppointmentReminder(appointmentData: any): Promise<SmsResult> {
    const message = `Rappel: RDV le ${appointmentData.date} à ${appointmentData.time} avec Dr. ${appointmentData.doctorName}. Hôpital ${appointmentData.hospitalName}.`;

    return await this.sendSms({
      to: appointmentData.patientPhone,
      message,
    });
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<SmsResult> {
    const message = `Votre code de vérification est: ${code}. Ce code expire dans 10 minutes. Ne le partagez avec personne.`;

    return await this.sendSms({
      to: phoneNumber,
      message,
    });
  }

  async sendPrescriptionReady(prescriptionData: any): Promise<SmsResult> {
    const message = `Votre prescription ${prescriptionData.prescriptionNumber} est prête. Passez à la pharmacie avec votre ordonnance.`;

    return await this.sendSms({
      to: prescriptionData.patientPhone,
      message,
    });
  }

  async sendLabResultsReady(labData: any): Promise<SmsResult> {
    const message = `Vos résultats de labo pour ${labData.testName} sont disponibles. Consultez votre médecin ou le portail patient.`;

    return await this.sendSms({
      to: labData.patientPhone,
      message,
    });
  }

  async sendPaymentConfirmation(paymentData: any): Promise<SmsResult> {
    const message = `Paiement confirmé: ${paymentData.amount} XOF. Réf: ${paymentData.paymentNumber}. Merci pour votre paiement.`;

    return await this.sendSms({
      to: paymentData.patientPhone,
      message,
    });
  }

  async sendEmergencyAlert(emergencyData: any): Promise<SmsResult[]> {
    const message = `URGENCE: ${emergencyData.message}. Patient: ${emergencyData.patientName}. Priorité: ${emergencyData.priority}. Localisation: ${emergencyData.location}.`;

    const results: SmsResult[] = [];

    for (const staffPhone of emergencyData.staffPhones) {
      const result = await this.sendSms({
        to: staffPhone,
        message,
      });
      results.push(result);
    }

    return results;
  }

  async sendBulkSms(recipients: string[], message: string): Promise<SmsResult[]> {
    const results: SmsResult[] = [];

    for (const recipient of recipients) {
      const result = await this.sendSms({
        to: recipient,
        message,
      });
      results.push(result);

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }

  async sendHealthCampaignMessage(campaignData: any): Promise<SmsResult[]> {
    const message = `${campaignData.title}: ${campaignData.message}. Pour plus d'infos: ${campaignData.contactNumber}`;

    return await this.sendBulkSms(campaignData.recipients, message);
  }

  async sendMedicationReminder(medicationData: any): Promise<SmsResult> {
    const message = `Rappel: Prenez votre médicament ${medicationData.medicationName} - ${medicationData.dosage}. ${medicationData.instructions}`;

    return await this.sendSms({
      to: medicationData.patientPhone,
      message,
    });
  }

  async sendBirthNotification(birthData: any): Promise<SmsResult[]> {
    const message = `Félicitations! ${birthData.motherName} a accouché d'un(e) ${birthData.babyGender} en bonne santé le ${birthData.birthDate}.`;

    const results: SmsResult[] = [];

    for (const contactPhone of birthData.familyContacts) {
      const result = await this.sendSms({
        to: contactPhone,
        message,
      });
      results.push(result);
    }

    return results;
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Senegal phone numbers: +221 XX XXX XX XX or XX XXX XX XX
    // Valid prefixes: 33, 70, 75, 76, 77, 78
    const senegalPattern = /^(\+221)?[337][0357678]\d{7}$/;
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    return senegalPattern.test(cleanNumber);
  }

  private calculateSmsCost(message: string): number {
    // SMS cost calculation (example: 25 XOF per 160 characters)
    const smsLength = 160;
    const costPerSms = 25;
    const smsCount = Math.ceil(message.length / smsLength);
    return smsCount * costPerSms;
  }

  async getSmsCreditBalance(): Promise<number> {
    // In production, this would query the SMS provider API for credit balance
    return 10000; // Placeholder: 10000 XOF
  }

  async getSmsStatistics(filters?: any): Promise<any> {
    // In production, this would query actual SMS records
    return {
      totalSent: 0,
      totalFailed: 0,
      totalCost: 0,
      byType: {},
    };
  }
}
