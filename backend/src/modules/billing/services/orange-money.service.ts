import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

interface OrangeMoneyPaymentRequest {
  phoneNumber: string;
  amount: number;
  invoiceId: string;
  description: string;
}

interface OrangeMoneyResponse {
  success: boolean;
  transactionId?: string;
  operatorTransactionId?: string;
  message?: string;
}

@Injectable()
export class OrangeMoneyService {
  // In production, these would come from environment variables
  private readonly apiUrl = process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/mobile-money/v1';
  private readonly merchantId = process.env.ORANGE_MONEY_MERCHANT_ID;
  private readonly apiKey = process.env.ORANGE_MONEY_API_KEY;

  constructor(private paymentService: PaymentService) {}

  async initiatePayment(request: OrangeMoneyPaymentRequest): Promise<OrangeMoneyResponse> {
    try {
      // Validate phone number format (Senegal Orange numbers)
      if (!this.validatePhoneNumber(request.phoneNumber)) {
        throw new BadRequestException('Invalid Orange Money phone number format');
      }

      // In production, this would make an actual API call to Orange Money
      // For now, we'll simulate the payment initiation
      const simulatedResponse = await this.simulateOrangeMoneyPayment(request);

      if (simulatedResponse.success) {
        // Create payment record
        await this.paymentService.create({
          invoiceId: request.invoiceId,
          amount: request.amount,
          paymentMethod: 'ORANGE_MONEY',
          phoneNumber: request.phoneNumber,
          transactionId: simulatedResponse.transactionId,
          operatorTransactionId: simulatedResponse.operatorTransactionId,
          notes: request.description,
        });
      }

      return simulatedResponse;
    } catch (error) {
      throw new BadRequestException(`Orange Money payment failed: ${error.message}`);
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<OrangeMoneyResponse> {
    // In production, this would query Orange Money API for transaction status
    // For now, we'll return a simulated response
    return {
      success: true,
      transactionId,
      operatorTransactionId: `OM${Date.now()}`,
      message: 'Payment completed successfully',
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<OrangeMoneyResponse> {
    try {
      // In production, this would call Orange Money refund API
      const simulatedRefund = await this.simulateOrangeMoneyRefund(transactionId, amount);

      return simulatedRefund;
    } catch (error) {
      throw new BadRequestException(`Orange Money refund failed: ${error.message}`);
    }
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Senegal Orange numbers: +221 77/78 XXX XX XX or 77/78 XXX XX XX
    const orangePattern = /^(\+221)?(77|78)\d{7}$/;
    return orangePattern.test(phoneNumber.replace(/\s/g, ''));
  }

  private async simulateOrangeMoneyPayment(request: OrangeMoneyPaymentRequest): Promise<OrangeMoneyResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        operatorTransactionId: `OM${Date.now()}`,
        message: 'Payment initiated successfully. Customer will receive prompt on their phone.',
      };
    } else {
      return {
        success: false,
        message: 'Payment initiation failed. Please try again.',
      };
    }
  }

  private async simulateOrangeMoneyRefund(transactionId: string, amount: number): Promise<OrangeMoneyResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId: `REFUND${Date.now()}`,
      operatorTransactionId: `OMR${Date.now()}`,
      message: `Refund of ${amount} processed successfully`,
    };
  }

  // Webhook handler for Orange Money payment notifications
  async handleWebhook(webhookData: any): Promise<void> {
    // In production, verify webhook signature first

    const { transactionId, status, operatorTransactionId } = webhookData;

    if (status === 'SUCCESS') {
      // Find payment by transaction ID and confirm it
      // This would require a method in PaymentService to find by transactionId
      // await this.paymentService.confirmPaymentByTransactionId(transactionId, { operatorTransactionId });
    } else if (status === 'FAILED') {
      // Mark payment as failed
      // await this.paymentService.failPaymentByTransactionId(transactionId, webhookData.failureReason);
    }
  }
}
