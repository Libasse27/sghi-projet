import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

interface WavePaymentRequest {
  phoneNumber: string;
  amount: number;
  invoiceId: string;
  description: string;
}

interface WaveResponse {
  success: boolean;
  transactionId?: string;
  operatorTransactionId?: string;
  message?: string;
  paymentUrl?: string;
}

@Injectable()
export class WaveService {
  // In production, these would come from environment variables
  private readonly apiUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1';
  private readonly apiKey = process.env.WAVE_API_KEY;
  private readonly secretKey = process.env.WAVE_SECRET_KEY;

  constructor(private paymentService: PaymentService) {}

  async initiatePayment(request: WavePaymentRequest): Promise<WaveResponse> {
    try {
      // Validate phone number format (Senegal Wave numbers)
      if (!this.validatePhoneNumber(request.phoneNumber)) {
        throw new BadRequestException('Invalid Wave phone number format');
      }

      // In production, this would make an actual API call to Wave
      // For now, we'll simulate the payment initiation
      const simulatedResponse = await this.simulateWavePayment(request);

      if (simulatedResponse.success) {
        // Create payment record
        await this.paymentService.create({
          invoiceId: request.invoiceId,
          amount: request.amount,
          paymentMethod: 'WAVE',
          phoneNumber: request.phoneNumber,
          transactionId: simulatedResponse.transactionId,
          operatorTransactionId: simulatedResponse.operatorTransactionId,
          notes: request.description,
        });
      }

      return simulatedResponse;
    } catch (error) {
      throw new BadRequestException(`Wave payment failed: ${error.message}`);
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<WaveResponse> {
    // In production, this would query Wave API for transaction status
    // For now, we'll return a simulated response
    return {
      success: true,
      transactionId,
      operatorTransactionId: `WV${Date.now()}`,
      message: 'Payment completed successfully',
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<WaveResponse> {
    try {
      // In production, this would call Wave refund API
      const simulatedRefund = await this.simulateWaveRefund(transactionId, amount);

      return simulatedRefund;
    } catch (error) {
      throw new BadRequestException(`Wave refund failed: ${error.message}`);
    }
  }

  async generatePaymentLink(request: WavePaymentRequest): Promise<WaveResponse> {
    try {
      // In production, this would call Wave API to generate payment link
      const paymentUrl = `https://pay.wave.com/${Date.now()}`;

      // Create payment record
      await this.paymentService.create({
        invoiceId: request.invoiceId,
        amount: request.amount,
        paymentMethod: 'WAVE',
        phoneNumber: request.phoneNumber,
        transactionId: `WAVE${Date.now()}`,
        notes: request.description,
      });

      return {
        success: true,
        transactionId: `WAVE${Date.now()}`,
        paymentUrl,
        message: 'Payment link generated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to generate Wave payment link: ${error.message}`);
    }
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Senegal phone numbers: +221 XX XXX XX XX or XX XXX XX XX
    const senegalPattern = /^(\+221)?[3-7]\d{8}$/;
    return senegalPattern.test(phoneNumber.replace(/\s/g, ''));
  }

  private async simulateWavePayment(request: WavePaymentRequest): Promise<WaveResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `WAVE${Date.now()}`,
        operatorTransactionId: `WV${Date.now()}`,
        message: 'Payment initiated successfully. Customer will receive prompt on their phone.',
      };
    } else {
      return {
        success: false,
        message: 'Payment initiation failed. Please try again.',
      };
    }
  }

  private async simulateWaveRefund(transactionId: string, amount: number): Promise<WaveResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId: `WAVEREFUND${Date.now()}`,
      operatorTransactionId: `WVR${Date.now()}`,
      message: `Refund of ${amount} processed successfully`,
    };
  }

  // Webhook handler for Wave payment notifications
  async handleWebhook(webhookData: any): Promise<void> {
    // In production, verify webhook signature first
    // const isValid = this.verifyWebhookSignature(webhookData);
    // if (!isValid) throw new BadRequestException('Invalid webhook signature');

    const { transactionId, status, operatorTransactionId } = webhookData;

    if (status === 'successful') {
      // Find payment by transaction ID and confirm it
      // This would require a method in PaymentService to find by transactionId
      // await this.paymentService.confirmPaymentByTransactionId(transactionId, { operatorTransactionId });
    } else if (status === 'failed') {
      // Mark payment as failed
      // await this.paymentService.failPaymentByTransactionId(transactionId, webhookData.error_message);
    }
  }

  private verifyWebhookSignature(webhookData: any): boolean {
    // In production, implement actual signature verification
    // using HMAC-SHA256 with the secret key
    return true;
  }
}
