import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransfersModule } from './transfers/transfers.module';
import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TransactionsModule,
    AuthModule,
    AccountsModule,
    CategoriesModule,
    TransfersModule,
    RecurringPaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
