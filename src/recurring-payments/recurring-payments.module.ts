import { Module } from '@nestjs/common';
import { RecurringPaymentsController } from './recurring-payments.controller';
import { RecurringPaymentsService } from './recurring-payments.service';

@Module({
  controllers: [RecurringPaymentsController],
  providers: [RecurringPaymentsService]
})
export class RecurringPaymentsModule {}
