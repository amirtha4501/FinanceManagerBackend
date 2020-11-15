import { Module } from '@nestjs/common';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../service/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '../repository/transaction.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRepository]),
    AuthModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
