import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../repository/transaction.repository';
import { Transaction } from '../entity/transaction.entity';
import { Category } from 'src/entity/category.entity';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(TransactionRepository)
        private transactionRepository: TransactionRepository
    ) {}

    async createTransaction(
        createTransactionDto: CreateTransactionDto,
        accounts: Account,
        categories: Category   
    ): Promise<Transaction> {
        return this.transactionRepository.createTransaction(createTransactionDto, accounts, categories);
    }

    async getTransactionById(id: number, accounts): Promise<Transaction> {
        var transactionIds: number[] = [];
        
        for(let account of accounts) {
            for(let transaction of account.transactions) {
                transactionIds.push(transaction.id);
            }
        }

        if(transactionIds.includes(id)) {
            const found = await this.transactionRepository.findOne(id, {
                relations:["category"]
            });
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
        accounts: Account,
        categories: Category
    ): Promise<Transaction[]> {
        return this.transactionRepository.getTransactions(filterTransactionsDto, accounts, categories);
    }

    async getTransactionsByCategory(
        accounts: Account,
        categories: Category
    ): Promise<any> {
        return this.transactionRepository.getTransactionsByCategory(accounts, categories);
    }

    async getMonthlyTransactions(accounts): Promise<Object[]> {
        return this.transactionRepository.getMonthlyTransactions(accounts);
    }
   
    async updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto, accounts, categories): Promise<Transaction> {
        const transaction = await this.getTransactionById(id, accounts);
        const { amount, type, title, note, tag, date, category_id, account_id } = updateTransactionDto;
        var currentAccount;
        var currentCategory;

        for(let account of accounts) {
            if(account.id == account_id) {
                currentAccount = account;
            }
        }

        for(let category of categories) {
            if(category.id == category_id) {
                currentCategory = category;
            }
        }
        
        transaction.amount = amount;
        transaction.type = type;
        transaction.title = title;
        transaction.note = note;
        transaction.tag = tag;
        transaction.date = date;
        
        if(currentCategory) {
            transaction.category = currentCategory;
        } else {
            throw new BadRequestException("Category does not exists");
        }
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
