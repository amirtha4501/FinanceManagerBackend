import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RecurringPaymentRepository } from './recurring-payment.repository';
import { RecurringPaymentsController } from './recurring-payments.controller';
import { RecurringPaymentsService } from './recurring-payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringPaymentRepository]),
    AuthModule
  ],
  controllers: [RecurringPaymentsController],
  providers: [RecurringPaymentsService]
})
export class RecurringPaymentsModule {}
