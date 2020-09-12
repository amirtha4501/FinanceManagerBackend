import { Repository, EntityRepository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { FilterTransactionsDto } from "./dto/filter-transactions.dto";
import { Transaction } from "./transaction.entity";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const {  amount, type, title, note, tag, date, is_planned, category_id, recurring_payment_id, account_id } = createTransactionDto;

        const transaction = new Transaction(); 
        
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

    async getTransactions(filterTransactionsDto: FilterTransactionsDto): Promise<Transaction[]> {
        const { type, category, account, dateFrom, dateTo, amountFrom, amountTo, tag } = filterTransactionsDto;
        const query = this.createQueryBuilder('transaction');
        
        if(type) {
            query.andWhere('transaction.type = :type', { type });
        }
        if(category) {
            query.andWhere('transaction.category = :category', { category });
        }
        if(account) {
            query.andWhere('transaction.account = :account', { account });
        }
        if(amountFrom && amountTo) {
            query.andWhere('transaction.amount >= :amountFrom AND transaction.amount <= :amountTo', { amountFrom, amountTo });
        }
        if(dateFrom && dateTo) {
            query.andWhere('transaction.date BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
        }
        if(tag) {
            query.andWhere('transaction.tag LIKE :tag', { tag: `%${tag}%` });
        }

        const transactions = await query.getMany();
        return transactions;
    }
}
