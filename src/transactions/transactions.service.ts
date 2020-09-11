import { Injectable, NotFoundException } from '@nestjs/common';
import { Type } from '../type.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transactions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(TransactionRepository)
        private transactionRepository: TransactionRepository
    ) {}

    async createTransactions(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { 
            id, 
            amount, 
            type, 
            title, 
            note, 
            tag, 
            date, 
            is_planned, 
            category_id, 
            recurring_payment_id, 
            account_id } = createTransactionDto;

        const transaction = new Transaction(); 
        
        transaction.id = id,  
        transaction.amount = amount,  
        transaction.type = type,  
        transaction.title = title,  
        transaction.note = note,  
        transaction.tag = tag,  
        transaction.date = date,  
        transaction.is_planned = is_planned,  
        transaction.category_id = category_id,  
        transaction.recurring_payment_id = recurring_payment_id,  
        transaction.account_id = account_id 

        await transaction.save();

        return transaction;
    }

    async getTransactionById(id: number): Promise<Transaction> {
        const found = await this.transactionRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Transaction with ID '${{id}}' not found`);
        }

        return found
    }

    // getTransactionById(id: number): Transaction {
    //     const found = this.transactions.find(transaction => transaction.id === id);

    //     if(!found) {
    //         console.log(found);
    //         throw new NotFoundException("Transaction not found");
    //     }
    //     return found;
    // }

    // getAllTransactions(): Transaction[] {
    //     return this.transactions;
    // }

    // getFilteredTransactions(filterTransactionDto: FilterTransactionDto): Transaction[] {
    //     const { type, amountFrom, amountTo } = filterTransactionDto;
        
    //     let transactions = this.getAllTransactions();

    //     if(type) {
    //         transactions = transactions.filter(transaction => transaction.type === type);
    //     }

    //     if(amountFrom && amountTo) {
    //         transactions = transactions.filter(
    //             transaction => transaction.amount >= amountFrom && transaction.amount <= amountTo
    //         );
    //     }
    //     return transactions;
    // }

    // updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto): Transaction {
    //     const transaction = this.getTransactionById(id);
    //     // const { amount, type, title } = updateTransactionDto;

    //     // transaction.amount = amount;
    //     // transaction.type = type;
    //     // transaction.title = title;
    //     console.log(transaction);
    //     return transaction;
    // }

    // deleteTransaction(id: number): void {
    //     this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    // }

}
