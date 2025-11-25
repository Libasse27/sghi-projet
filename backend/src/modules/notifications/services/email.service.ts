import { Injectable } from '@nestjs/common';

interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  attachments?: any[];
  isHtml?: boolean;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  // In production, these would come from environment variables
  private readonly smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  private readonly fromEmail = process.env.FROM_EMAIL || 'noreply@hospital.sn';
  private readonly fromName = process.env.FROM_NAME || 'Système Hospitalier';

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // In production, this would use a library like nodemailer
      // For now, we'll simulate email sending
      console.log('Sending email:', {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        body: options.body,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate 95% success rate
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        return {
          success: true,
          messageId: `MSG-${Date.now()}`,
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendWelcomeEmail(userData: any): Promise<EmailResult> {
    const htmlBody = `
      <h2>Bienvenue ${userData.firstName} ${userData.lastName}</h2>
      <p>Votre compte a été créé avec succès.</p>
      <p><strong>Numéro de patient:</strong> ${userData.patientNumber}</p>
      <p>Vous pouvez maintenant accéder à votre dossier médical en ligne.</p>
      <p>Cordialement,<br>L'équipe de l'hôpital</p>
    `;

    return await this.sendEmail({
      to: userData.email,
      subject: 'Bienvenue à notre hôpital',
      body: htmlBody,
      isHtml: true,
    });
  }

  async sendAppointmentConfirmation(appointmentData: any): Promise<EmailResult> {
    const htmlBody = `
      <h2>Confirmation de rendez-vous</h2>
      <p>Cher(e) ${appointmentData.patientName},</p>
      <p>Votre rendez-vous a été confirmé avec les détails suivants:</p>
      <ul>
        <li><strong>Date:</strong> ${appointmentData.date}</li>
        <li><strong>Heure:</strong> ${appointmentData.time}</li>
        <li><strong>Médecin:</strong> Dr. ${appointmentData.doctorName}</li>
        <li><strong>Département:</strong> ${appointmentData.department}</li>
      </ul>
      <p>Veuillez arriver 15 minutes avant l'heure du rendez-vous.</p>
      <p>Cordialement,<br>L'équipe de l'hôpital</p>
    `;

    return await this.sendEmail({
      to: appointmentData.patientEmail,
      subject: 'Confirmation de rendez-vous',
      body: htmlBody,
      isHtml: true,
    });
  }

  async sendLabResultsEmail(labData: any): Promise<EmailResult> {
    const htmlBody = `
      <h2>Résultats de laboratoire disponibles</h2>
      <p>Cher(e) ${labData.patientName},</p>
      <p>Vos résultats de laboratoire pour <strong>${labData.testName}</strong> sont maintenant disponibles.</p>
      <p><strong>Numéro d'analyse:</strong> ${labData.analysisNumber}</p>
      <p>Veuillez prendre rendez-vous avec votre médecin pour discuter des résultats.</p>
      <p>Vous pouvez également consulter vos résultats en ligne via votre portail patient.</p>
      <p>Cordialement,<br>Le service de laboratoire</p>
    `;

    return await this.sendEmail({
      to: labData.patientEmail,
      subject: 'Résultats de laboratoire disponibles',
      body: htmlBody,
      isHtml: true,
    });
  }

  async sendInvoiceEmail(invoiceData: any): Promise<EmailResult> {
    const htmlBody = `
      <h2>Nouvelle facture</h2>
      <p>Cher(e) ${invoiceData.patientName},</p>
      <p>Une nouvelle facture a été générée pour vos services médicaux.</p>
      <ul>
        <li><strong>Numéro de facture:</strong> ${invoiceData.invoiceNumber}</li>
        <li><strong>Date de facturation:</strong> ${invoiceData.invoiceDate}</li>
        <li><strong>Montant:</strong> ${invoiceData.amount} XOF</li>
        <li><strong>Date d'échéance:</strong> ${invoiceData.dueDate}</li>
      </ul>
      <p>Vous pouvez payer en ligne ou à la réception de l'hôpital.</p>
      <p>Cordialement,<br>Le service de facturation</p>
    `;

    return await this.sendEmail({
      to: invoiceData.patientEmail,
      subject: `Facture ${invoiceData.invoiceNumber}`,
      body: htmlBody,
      isHtml: true,
    });
  }

  async sendPasswordResetEmail(resetData: any): Promise<EmailResult> {
    const htmlBody = `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Cher(e) ${resetData.userName},</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:</p>
      <p><a href="${resetData.resetLink}">Réinitialiser le mot de passe</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
      <p>Cordialement,<br>L'équipe de l'hôpital</p>
    `;

    return await this.sendEmail({
      to: resetData.email,
      subject: 'Réinitialisation de mot de passe',
      body: htmlBody,
      isHtml: true,
    });
  }

  async sendBulkEmail(recipients: string[], subject: string, body: string): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to: recipient,
        subject,
        body,
        isHtml: true,
      });
      results.push(result);
    }

    return results;
  }

  async sendEmailWithAttachment(options: EmailOptions, attachments: any[]): Promise<EmailResult> {
    return await this.sendEmail({
      ...options,
      attachments,
    });
  }

  async sendNewsletterEmail(newsletterData: any): Promise<EmailResult[]> {
    const htmlBody = `
      <h2>${newsletterData.title}</h2>
      <div>${newsletterData.content}</div>
      <hr>
      <p><small>Vous recevez cet e-mail car vous êtes inscrit à notre newsletter.</small></p>
    `;

    return await this.sendBulkEmail(
      newsletterData.recipients,
      newsletterData.title,
      htmlBody,
    );
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      // In production, this would test SMTP connection
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}
