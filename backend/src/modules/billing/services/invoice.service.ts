import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Invoice, InvoiceStatus, InvoiceItem } from '../entities/invoice.entity';
import { BillingService } from './billing.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private billingService: BillingService,
  ) {}

  async create(createDto: any): Promise<Invoice> {
    const numeroFacture = await this.generateInvoiceNumber();

    // Calculate totals
    let subtotal = 0;
    const items: InvoiceItem[] = [];

    for (const item of createDto.items) {
      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;

      items.push({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
        serviceCode: item.serviceCode,
        serviceDate: item.serviceDate,
      });
    }

    const taxAmount = subtotal * (createDto.taxRate || 0) / 100;
    const discountAmount = createDto.discountAmount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Calculate insurance coverage
    const insuranceCoverage = createDto.insuranceCoverage || 0;
    const patientResponsibility = totalAmount - insuranceCoverage;

    const invoice = this.invoiceRepository.create({
      ...createDto,
      numeroFacture,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      insuranceCoverage,
      patientResponsibility,
      balanceDue: totalAmount,
      paidAmount: 0,
      status: InvoiceStatus.PENDING,
    });

    const saved = await this.invoiceRepository.save(invoice) as any as Invoice;
    return saved;
  }

  async findAll(filters?: any): Promise<Invoice[]> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.patient', 'patient')
      .leftJoinAndSelect('invoice.createdBy', 'createdBy')
      .leftJoinAndSelect('invoice.payments', 'payments');

    if (filters?.patientId) {
      query.andWhere('invoice.patientId = :patientId', { patientId: filters.patientId });
    }

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('invoice.type = :type', { type: filters.type });
    }

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('invoice.invoiceDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    return await query.orderBy('invoice.invoiceDate', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['patient', 'createdBy', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    return invoice;
  }

  async update(id: string, updateDto: any): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot update a paid invoice');
    }

    // Recalculate if items changed
    if (updateDto.items) {
      let subtotal = 0;
      const items: InvoiceItem[] = [];

      for (const item of updateDto.items) {
        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;
        items.push({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: itemTotal,
          serviceCode: item.serviceCode,
          serviceDate: item.serviceDate,
        });
      }

      const taxRate = updateDto.taxRate ?? invoice.taxRate;
      const taxAmount = subtotal * (taxRate / 100);
      const discountAmount = updateDto.discountAmount ?? invoice.discountAmount;
      const totalAmount = subtotal + taxAmount - discountAmount;

      updateDto.items = items;
      updateDto.subtotal = subtotal;
      updateDto.taxAmount = taxAmount;
      updateDto.totalAmount = totalAmount;
      updateDto.balanceDue = totalAmount - invoice.paidAmount;
    }

    Object.assign(invoice, updateDto);
    const saved = await this.invoiceRepository.save(invoice) as any as Invoice;
    return saved;
  }

  async recordPayment(invoiceId: string, paymentAmount: number): Promise<Invoice> {
    const invoice = await this.findOne(invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already fully paid');
    }

    invoice.paidAmount += paymentAmount;
    invoice.balanceDue = invoice.totalAmount - invoice.paidAmount;

    if (invoice.balanceDue <= 0) {
      invoice.status = InvoiceStatus.PAID;
      invoice.balanceDue = 0;
    } else if (invoice.paidAmount > 0) {
      invoice.status = InvoiceStatus.PARTIALLY_PAID;
    }

    return await this.invoiceRepository.save(invoice) as any as Invoice;
  }

  async cancelInvoice(id: string, reason: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    invoice.notes = `${invoice.notes || ''}\nCancelled: ${reason}`;

    return await this.invoiceRepository.save(invoice) as any as Invoice;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const today = new Date();

    return await this.invoiceRepository.find({
      where: {
        dueDate: LessThan(today),
        status: InvoiceStatus.PENDING,
      },
      relations: ['patient'],
      order: { dueDate: 'ASC' },
    });
  }

  async markOverdue(): Promise<void> {
    const overdueInvoices = await this.getOverdueInvoices();

    for (const invoice of overdueInvoices) {
      invoice.status = InvoiceStatus.OVERDUE;
      await this.invoiceRepository.save(invoice);
    }
  }

  async getInvoiceStatistics(filters?: any): Promise<any> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (filters?.dateDebut && filters?.dateFin) {
      query.andWhere('invoice.invoiceDate BETWEEN :dateDebut AND :dateFin', {
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
      });
    }

    const totalInvoices = await query.getCount();

    const paidInvoices = await query.clone().andWhere('invoice.status = :status', { status: InvoiceStatus.PAID }).getCount();

    const pendingInvoices = await query.clone().andWhere('invoice.status = :status', { status: InvoiceStatus.PENDING }).getCount();

    const overdueInvoices = await query.clone().andWhere('invoice.status = :status', { status: InvoiceStatus.OVERDUE }).getCount();

    const totalRevenue = await query
      .clone()
      .select('SUM(invoice.paidAmount)', 'total')
      .getRawOne();

    const outstandingBalance = await query
      .clone()
      .select('SUM(invoice.balanceDue)', 'total')
      .getRawOne();

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalRevenue: parseFloat(totalRevenue.total || 0),
      outstandingBalance: parseFloat(outstandingBalance.total || 0),
      collectionRate: totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(2) : 0,
    };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `FACT-${year}${month}-`;

    const lastInvoice = await this.invoiceRepository.findOne({
      where: {},
      order: { dateCreation: 'DESC' },
    });

    let nextNumber = 1;
    if (lastInvoice && lastInvoice.numeroFacture.startsWith(prefix)) {
      const lastNumber = parseInt(lastInvoice.numeroFacture.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
