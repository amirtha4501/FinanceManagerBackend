import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(TransactionRepository)
        private transactionRepository: TransactionRepository
    ) {}

    async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionRepository.createTransaction(createTransactionDto);
    }

    async getTransactionById(id: number): Promise<Transaction> {
        const found = await this.transactionRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Transaction with ID '${id}' not found`);
        }

        return found
    }

    async getTransactions(filterTransactionsDto: FilterTransactionsDto): Promise<Transaction[]> {
        return this.transactionRepository.getTransactions(filterTransactionsDto);
    }
   
    async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
        const transaction = await this.getTransactionById(id);
        const { amount, type, title, note, tag, date, category_id, account_id } = updateTransactionDto;

        transaction.amount = amount;
        transaction.type = type;
        transaction.title = title;
        transaction.note = note;
        transaction.tag = tag;
        transaction.date = date;
        transaction.category_id = category_id;
        transaction.account_id = account_id;

        await transaction.save();
        return transaction;
    }

    async deleteTransaction(id: number): Promise<void> {
        const result = await this.transactionRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Transaction not found to delete`);
        }
    }
}
