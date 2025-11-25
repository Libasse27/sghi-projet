import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { PriceList } from './entities/price-list.entity';
import { BillingService } from './services/billing.service';
import { InvoiceService } from './services/invoice.service';
import { PaymentService } from './services/payment.service';
import { OrangeMoneyService } from './services/orange-money.service';
import { WaveService } from './services/wave.service';
import { InsuranceService } from './services/insurance.service';
import { InvoicesController } from './controllers/invoices.controller';
import { PaymentsController } from './controllers/payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Payment, PriceList])],
  controllers: [InvoicesController, PaymentsController],
  providers: [
    BillingService,
    InvoiceService,
    PaymentService,
    OrangeMoneyService,
    WaveService,
    InsuranceService,
  ],
  exports: [
    BillingService,
    InvoiceService,
    PaymentService,
    OrangeMoneyService,
    WaveService,
    InsuranceService,
  ],
})
export class BillingModule {}
