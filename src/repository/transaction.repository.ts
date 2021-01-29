import { BadRequestException, NotFoundException } from "@nestjs/common";
// import { Category } from "src/entity/category.entity";
import { Repository, EntityRepository } from "typeorm";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { FilterTransactionsDto } from "../dto/filter-transactions.dto";
import { Transaction } from "../entity/transaction.entity";

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
    transactions: any[] = [];
    // tee: any = [];

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
            // console.log(category);
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

        // var par = [];
        // var par = Object.keys(categorizedTransactions);

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
                data[key] = value; // - to return with parent id
                // categories.forEach(cat => {
                //     if (cat.id == key) {
                //         // data[cat.name] = value; // - to return with parent name 
                //     }
                // });
                this.transactions.push(data)
            }

        }

        return this.transactions;
    }
}

                // // this.transactions.forEach(transaction => {
                //     for (let i = 0; i < this.transactions.length; i++) {
                //         this.tee.push(Object.keys(this.transactions[i]))
                //         console.log("par");
                //         console.log(this.transactions);
                //         console.log(key + ' ' + typeof key);
                //         console.log(this.tee);
                //         console.log(!this.tee.includes(key));

                //         if (!this.tee.includes(key)) {
                //             console.log("tra bef");
                //             console.log(this.transactions);
                //             this.transactions.push(data);
                //             console.log("tra af");
                //             console.log(this.transactions);
                //         }
                //     }
                //     // });

                // console.log("transaction st")
                // console.log(transaction)
                // console.log(Object.keys(transaction)[0] + " " + typeof Object.keys(transaction)[0])
                // console.log(key + " " + typeof key);
                // console.log(this.transactions);
                // console.log(Object.keys(transaction)[0] != key);

                // if (Object.keys(transaction)[0] != key) {
                //     // this.tee.push(Object.keys(transaction)[0]);
                //     this.transactions.push(data);
                // }

