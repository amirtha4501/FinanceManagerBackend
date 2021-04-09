import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { FilterTransactionsDto } from "../dto/filter-transactions.dto";
import { Transaction } from "../entity/transaction.entity";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    transactions: any[] = [];
    namedTransactions: any[] = [];

    async createTransaction(createTransactionDto: CreateTransactionDto, accounts, categories): Promise<Transaction> {
        const { amount, type, title, note, tag, date, account_id, category_id, is_planned, recurring_payment_id } = createTransactionDto;
        var currentAccount;
        var currentCategory;

        for (let account of accounts) {
            if (account.id == account_id) {
                currentAccount = account;
            }
        }

        for (let category of categories) {
            if (category.id == category_id) {
                currentCategory = category;
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
            transaction.recurring_payment_id = recurring_payment_id;

        if (currentAccount && currentCategory) {
            transaction.account = currentAccount;
            transaction.category = currentCategory;

            if (transaction.type == 'expense') {
                currentAccount.current_amount -= amount;
            } else {
                currentAccount.current_amount = +currentAccount.current_amount + +amount;
            }
        } else {
            if (!currentAccount) {
                throw new BadRequestException("Account does not exist");
            } else {
                throw new BadRequestException("Category does not exist");
            }
        }

        await currentAccount.save();
        await transaction.save();

        return transaction;
    }

    async getTransactions(filterTransactionsDto: FilterTransactionsDto, accounts, categories): Promise<Transaction[]> {

        const { type, categoryName, specifiedAccount, dateFrom, dateTo, amountFrom, amountTo, tag } = filterTransactionsDto;
        const query = this.createQueryBuilder('transaction').leftJoinAndSelect("transaction.category", "category");
        var ids: number[] = [];
        var categoryId: number;

        for (let account of accounts) {
            ids.push(account.id);
        }

        for (let category of categories) {
            if (category.name == categoryName) {
                categoryId = category.id;
            }
        }

        if (!specifiedAccount) {
            if (!type && !categoryName && !amountFrom && !amountTo && !dateFrom && !dateTo && !tag) {
                query.where('transaction.account IN (:...ids)', { ids });
            }
            if (type) {
                query.andWhere('transaction.type = :type AND transaction.account IN (:...ids)', { type, ids });
            }
            if (categoryName) {
                query.andWhere('transaction.category_id = :categoryId AND transaction.account IN (:...ids)', { categoryId, ids });
            }
            if (amountFrom && amountTo) {
                query.andWhere('transaction.amount >= :amountFrom AND transaction.amount <= :amountTo AND transaction.account IN (:...ids)', { amountFrom, amountTo, ids });
            }
            if (dateFrom && dateTo) {
                query.andWhere('transaction.date BETWEEN :dateFrom AND :dateTo AND transaction.account IN (:...ids)', { dateFrom, dateTo, ids });
            }
            if (tag) {
                query.andWhere('transaction.tag LIKE :tag AND transaction.account IN (:...ids)', { tag: `%${tag}%`, ids });
            }
        }

        if (specifiedAccount) {

            var accountPresent: boolean;

            for (let id of ids) {
                if (id == specifiedAccount) {
                    accountPresent = true;
                }
            }

            if (!accountPresent) {
                throw new NotFoundException("Specified account doesn't exist");
            }

            if (!type && !categoryName && !amountFrom && !amountTo && !dateFrom && !dateTo && !tag) {
                query.where('transaction.account = :specifiedAccount', { specifiedAccount });
            }
            if (type) {
                query.andWhere('transaction.type = :type AND transaction.account = :specifiedAccount', { type, specifiedAccount });
            }
            if (categoryName) {
                query.andWhere('transaction.category_id = :categoryId AND transaction.account = :specifiedAccount', { categoryId, specifiedAccount });
            }
            if (amountFrom && amountTo) {
                query.andWhere('transaction.amount >= :amountFrom AND transaction.amount <= :amountTo AND transaction.account = :specifiedAccount', { amountFrom, amountTo, specifiedAccount });
            }
            if (dateFrom && dateTo) {
                query.andWhere('transaction.date BETWEEN :dateFrom AND :dateTo AND transaction.account = :specifiedAccount', { dateFrom, dateTo, specifiedAccount });
            }
            if (tag) {
                query.andWhere('transaction.tag LIKE :tag AND transaction.account = :specifiedAccount', { tag: `%${tag}%`, specifiedAccount });
            }
        }
        const transactions = await query.getMany();

        return transactions;
    }

    async getTransactionsByCategory(accounts, categories): Promise<any> {
        const query = this.createQueryBuilder('transaction').leftJoinAndSelect("transaction.category", "category");
        var ids: number[] = [];
        var categoryIds: number[] = [];

        for (let account of accounts) {
            ids.push(account.id);
        }

        for (let category of categories) {
            categoryIds.push(category.id);
        }

        query.where('transaction.account IN (:...ids)', { ids });

        const transactions = await query.getMany();

        var alignedTransactions = Object.values(transactions.reduce((result, {
            amount,
            type,
            category
        }) => {
            // Create new group
            if (!result[category.id]) result[category.id] = {
                category,
                transactions: [],
                total: 0
            };
            // Append to group
            result[category.id].transactions.push({
                amount,
                type
            });
            return result;
        }, {}));

        var categorizedTransactions = alignedTransactions.reduce(function (r, a) {
            r[a['category'].parent_id] = r[a['category'].parent_id] || [];

            if (r[a['category'].parent_id] == null || '') {
                r[a['category'].parent_id] = 0;
            }
            r[a['category'].parent_id].push(a);
            return r;
        }, Object.create(null));

        for (let [key, value] of Object.entries(categorizedTransactions)) {

            value.forEach(val => {
                val.transactions.forEach(transaction => {
                    if (transaction.type === "income") {
                        val.total = +val.total + +transaction.amount;
                    } else {
                        val.total -= transaction.amount;
                    }
                });
            });
            var transIds = this.transactions.map(x => Object.keys(x)[0]);
            if (!transIds.includes(key)) {
                let data = {}
                let category = categories.find(category => category.id == key);

                let detail = {
                    name: category.name,
                    color: category.color,
                    info: value,
                }
                data[key] = detail; // - to return with parent id
                this.transactions.push(data)
            }
        }

        // this.transactions.forEach(element => {            
        //     var data = {};
        //     categories.forEach(element => {
        //         // console.log(element)
        //         // console.log(element.id + " " + Object.keys(this.transactions)[0])
        //         // console.log(typeof element.id.toString() + " - " + typeof Object.keys(element)[0])

        //         if(element.id.toString() == Object.keys(element)[0]) {
        //             var name = element.name;
        //             data[name] = element[Object.keys(element)[0]]
        //         }
        //     });
                
        // });
        return this.transactions;
    }
}
