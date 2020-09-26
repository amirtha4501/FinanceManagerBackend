import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createTransaction(
        createTransactionDto: CreateTransactionDto,
        accounts: Account    
    ): Promise<Transaction> {
        return this.transactionRepository.createTransaction(createTransactionDto, accounts);
    }

    async getTransactionById(id: number, accounts): Promise<Transaction> {
        var transactionIds: number[] = [];
        
        for(let account of accounts) {
            for(let transaction of account.transactions) {
                transactionIds.push(transaction.id);
            }
        }

        if(transactionIds.includes(id)) {
            const found = await this.transactionRepository.findOne(id);
            if(!found) {
                throw new NotFoundException(`Transaction with ID '${id}' not found`);
            }
            return found
        } else {
            throw new BadRequestException("Transaction id is not exists in the user accounts");
        }
    }

    async getTransactions(
        filterTransactionsDto: FilterTransactionsDto,
        accounts: Account
    ): Promise<Transaction[]> {
        return this.transactionRepository.getTransactions(filterTransactionsDto, accounts);
    }
   
    async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto, accounts): Promise<Transaction> {
        const transaction = await this.getTransactionById(id, accounts);
        const { amount, type, title, note, tag, date, category_id, account_id } = updateTransactionDto;
        var currentAccount;

        for(let account of accounts) {
            if(account.id == account_id) {
                currentAccount = account;
            }
        }
        
        transaction.amount = amount;
        transaction.type = type;
        transaction.title = title;
        transaction.note = note;
        transaction.tag = tag;
        transaction.date = date;
        transaction.category_id = category_id;
        if(currentAccount) {
            transaction.account = currentAccount;
        } else {
            throw new BadRequestException("Transaction does not exist in the user account");
        }

        await transaction.save();
        return transaction;
    }

    async deleteTransaction(id: number, accounts): Promise<void> {
        var transactionIds: number[] = [];
        
        for(let account of accounts) {
            for(let transaction of account.transactions) {
                transactionIds.push(transaction.id);
            }
        }

        if(transactionIds.includes(id)) {

            const result = await this.transactionRepository.delete(id);
            
            if(result.affected === 0) {
                throw new NotFoundException(`Transaction not found to delete`);
            }
        } else {
            throw new BadRequestException("Transaction id is not exists in the user accounts");
        }
    }
}
