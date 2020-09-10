import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, Type } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transactions.dto';

@Injectable()
export class TransactionsService {
    private transactions: Transaction[] = [];

    createTransactions(createTransactionDto: CreateTransactionDto): Transaction {
        const { amount, type, title } = createTransactionDto;
        const transaction: Transaction = {
            id: 1,
            amount,
            type,
            title
        }
        this.transactions.push(transaction);
        return transaction;
    }

    getTransactionById(id: number): Transaction {
        const found = this.transactions.find(transaction => transaction.id === id);

        if(!found) {
            console.log(found);
            throw new NotFoundException("Transaction not found");
        }
        return found;
    }

    getAllTransactions(): Transaction[] {
        return this.transactions;
    }

    getFilteredTransactions(filterTransactionDto: FilterTransactionDto): Transaction[] {
        const { type, amountFrom, amountTo } = filterTransactionDto;
        
        let transactions = this.getAllTransactions();

        if(type) {
            transactions = transactions.filter(transaction => transaction.type === type);
        }

        if(amountFrom && amountTo) {
            transactions = transactions.filter(
                transaction => transaction.amount >= amountFrom && transaction.amount <= amountTo
            );
        }
        return transactions;
    }

    updateTransaction(id: number, updateTransactionDto: UpdateTransactionDto): Transaction {
        const transaction = this.getTransactionById(id);
        // const { amount, type, title } = updateTransactionDto;

        // transaction.amount = amount;
        // transaction.type = type;
        // transaction.title = title;
        console.log(transaction);
        return transaction;
    }

    deleteTransaction(id: number): void {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    }

}
