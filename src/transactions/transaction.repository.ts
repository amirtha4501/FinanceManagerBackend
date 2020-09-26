import { BadRequestException } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { FilterTransactionsDto } from "./dto/filter-transactions.dto";
import { Transaction } from "./transaction.entity";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {

    async createTransaction(createTransactionDto: CreateTransactionDto, accounts) {
        
        const {  amount, type, title, note, tag, date, account_id, is_planned, category_id, recurring_payment_id } = createTransactionDto;
        var currentAccount;
        
        for(let account of accounts) {
            if(account.id == account_id) {
                currentAccount = account;
            }
        }

        const transaction = new Transaction(); 
        
        transaction.amount = amount,  
        transaction.type = type,  
        transaction.title = title,  
        transaction.note = note,  
        transaction.tag = tag,  
        transaction.date = date,  
        transaction.is_planned = is_planned,  
        transaction.category_id = category_id,  
        transaction.recurring_payment_id = recurring_payment_id;
        
        if(currentAccount) {
            transaction.account = currentAccount; 
        } else {
            throw new BadRequestException("Account does not exist in the user account");
        }

        await transaction.save();

        return transaction;
    }

    async getTransactions(filterTransactionsDto: FilterTransactionsDto, accounts): Promise<Transaction[]> {
        const { type, category, specifiedAccount, dateFrom, dateTo, amountFrom, amountTo, tag } = filterTransactionsDto;
        const query = this.createQueryBuilder('transaction');
        var ids: number[] = [];
        
        for(let account of accounts) {
            ids.push(account.id);
        }

        if(!type && !category && !amountFrom && !amountTo && !dateFrom && !dateTo && !tag) {
            query.where('transaction.account IN (:...ids)', { ids });
        }

        if(!specifiedAccount) {
            if(type) {
                query.andWhere('transaction.type = :type AND transaction.account IN (:...ids)', { type, ids });
            }
            if(category) {
                query.andWhere('transaction.category = :category AND transaction.account IN (:...ids)', { category, ids });
            }
            if(amountFrom && amountTo) {
                query.andWhere('transaction.amount >= :amountFrom AND transaction.amount <= :amountTo AND transaction.account IN (:...ids)', { amountFrom, amountTo, ids });
            }
            if(dateFrom && dateTo) {
                query.andWhere('transaction.date BETWEEN :dateFrom AND :dateTo AND transaction.account IN (:...ids)', { dateFrom, dateTo, ids });
            }
            if(tag) {
                query.andWhere('transaction.tag LIKE :tag AND transaction.account IN (:...ids)', { tag: `%${tag}%`, ids });
            }
        }

        if(specifiedAccount) {
            query.where('transaction.account = :specifiedAccount', { specifiedAccount });
        }
        
        const transactions = await query.getMany();
        return transactions;
    }
}
