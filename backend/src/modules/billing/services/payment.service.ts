import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { InvoiceService } from './invoice.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private invoiceService: InvoiceService,
  ) {}

  async create(createDto: any): Promise<Payment> {
    const numeroPaiement = await this.generatePaymentNumber();

    // Validate invoice
    const invoice = await this.invoiceService.findOne(createDto.invoiceId);

    if (invoice.balanceDue < createDto.amount) {
      throw new BadRequestException(
        `Payment amount (${createDto.amount}) exceeds balance due (${invoice.balanceDue})`,
      );
    }

    const payment = this.paymentRepository.create({
      ...createDto,
      numeroPaiement,
      paymentDate: new Date(),
      status: PaymentStatus.PENDING,
    });

    const saved = await this.paymentRepository.save(payment) as any as Payment;

    // Update invoice with payment amount
    await this.invoiceService.recordPayment(createDto.invoiceId, createDto.amount);

    return saved;
  }

  async findAll(filters?: any): Promise<Payment[]> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('invoice.patient', 'patient')
      .leftJoinAndSelect('payment.receivedBy', 'receivedBy');

    if (filters?.invoiceId) {
      query.andWhere('payment.invoiceId = :invoiceId', { invoiceId: filters.invoiceId });
    }

    if (filters?.status) {
      query.andWhere('payment.status = :status', { status: filters.status });
    }

    if (filters?.paymentMethod) {
      query.andWhere('payment.paymentMethod = :paymentMethod', { paymentMethod: filters.paymentMethod });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('payment.paymentDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('payment.paymentDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice', 'invoice.patient', 'receivedBy'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    return payment;
  }

  async confirmPayment(id: string, transactionData: any): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = transactionData.transactionId;
    payment.operatorTransactionId = transactionData.operatorTransactionId;

    return await this.paymentRepository.save(payment) as any as Payment;
  }

  async failPayment(id: string, reason: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    payment.status = PaymentStatus.FAILED;
    payment.notes = `${payment.notes || ''}\nFailed: ${reason}`;

    // Revert the payment amount from invoice
    const invoice = await this.invoiceService.findOne(payment.invoiceId);
    invoice.paidAmount -= payment.amount;
    invoice.balanceDue = invoice.totalAmount - invoice.paidAmount;

    return await this.paymentRepository.save(payment) as any as Payment;
  }

  async refundPayment(id: string, refundData: any): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.notes = `${payment.notes || ''}\nRefunded: ${refundData.reason}`;

    // Revert the payment amount from invoice
    const invoice = await this.invoiceService.findOne(payment.invoiceId);
    invoice.paidAmount -= payment.amount;
    invoice.balanceDue = invoice.totalAmount - invoice.paidAmount;

    return await this.paymentRepository.save(payment) as any as Payment;
  }

  async getPaymentStatistics(filters?: any): Promise<any> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('payment.paymentDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    const totalPayments = await query.getCount();

    const completedPayments = await query
      .clone()
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getCount();

    const totalAmount = await query
      .clone()
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    // Group by payment method
    const byMethod = await query
      .clone()
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .select('payment.paymentMethod', 'method')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'total')
      .groupBy('payment.paymentMethod')
      .getRawMany();

    return {
      totalPayments,
      completedPayments,
      totalAmount: parseFloat(totalAmount.total || 0),
      byMethod: byMethod.map((item) => ({
        method: item.method,
        count: parseInt(item.count),
        total: parseFloat(item.total),
      })),
      successRate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0,
    };
  }

  private async generatePaymentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `PAY-${year}${month}-`;

    const lastPayment = await this.paymentRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastPayment && lastPayment.numeroPaiement.startsWith(prefix)) {
      const lastNumber = parseInt(lastPayment.numeroPaiement.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
