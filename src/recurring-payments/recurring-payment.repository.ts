import { BadRequestException } from "@nestjs/common";
import { Category } from "src/categories/category.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateRecurringPaymentDto } from "./dto/create-recurring-payment.dto";
import { FilterRecurringPaymentsDto } from "./dto/filter-recurring-payment";
import { RecurringPayment } from "./recurring-payment.entity";

@EntityRepository(RecurringPayment)
export class RecurringPaymentRepository extends Repository<RecurringPayment> {

    async createRecurringPayment(createRecurringPaymentDto: CreateRecurringPaymentDto, accounts, categories): Promise<RecurringPayment> {

        const { amount, type, title, note, tag, date, start_date, end_date, frequency, account_id, category_id } = createRecurringPaymentDto;
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

        const recurringPayment = new RecurringPayment();

        recurringPayment.amount = amount,
        recurringPayment.type = type,
        recurringPayment.title = title,
        recurringPayment.note = note,
        recurringPayment.tag = tag,
        recurringPayment.date = date,
        recurringPayment.start_date = start_date,
        recurringPayment.end_date = end_date,
        recurringPayment.frequency = frequency
        // recurringPayment.account = account_id
  
        if(currentAccount && currentCategory) {
            recurringPayment.account = currentAccount; 
            recurringPayment.category = currentCategory  
        } else {
            if(!currentAccount) {
                throw new BadRequestException("Account does not exist in the user account");
            } else {
                throw new BadRequestException("Category does not exist in the user account");
            }
        }

        await recurringPayment.save();

        return recurringPayment;
    }

    async getRecurringPayments(filterRecurringPaymentsDto: FilterRecurringPaymentsDto, accounts, categories): Promise<RecurringPayment[]> {
        const { type, categoryName, specifiedAccount, dateFrom, dateTo, amountFrom, amountTo, tag } = filterRecurringPaymentsDto;
        const query = this.createQueryBuilder('recurringPayment');
        var ids: number[] = [];
        var categoryId: number;
        
        for(let account of accounts) {
            ids.push(account.id);
        }

        for(let category of categories) {
            if(category.name == categoryName) {
                categoryId = category.id;
            }
        }

        if(!specifiedAccount) {
            if(!type && !categoryName && !amountFrom && !amountTo && !dateFrom && !dateTo && !tag) {
                query.where('recurringPayment.account IN (:...ids)', { ids });
            }
            if(type) {
                query.andWhere('recurringPayment.type = :type AND recurringPayment.account IN (:...ids)', { type, ids });
            }
            if(categoryName) {
                query.andWhere('recurringPayment.category = :categoryId AND recurringPayment.account IN (:...ids)', { categoryId, ids });
            }
            if(amountFrom && amountTo) {
                query.andWhere('recurringPayment.amount >= :amountFrom AND recurringPayment.amount <= :amountTo AND recurringPayment.account IN (:...ids)', { amountFrom, amountTo, ids });
            }
            if(dateFrom && dateTo) {
                query.andWhere('recurringPayment.date BETWEEN :dateFrom AND :dateTo AND recurringPayment.account IN (:...ids)', { dateFrom, dateTo, ids });
            }
            if(tag) {
                query.andWhere('recurringPayment.tag LIKE :tag AND recurringPayment.account IN (:...ids)', { tag: `%${tag}%`, ids });
            }
        }

        if(specifiedAccount) {

            if(!type && !categoryName && !amountFrom && !amountTo && !dateFrom && !dateTo && !tag) {
                query.where('recurringPayment.account = :specifiedAccount', { specifiedAccount });
            }
            if(type) {
                query.andWhere('recurringPayment.type = :type AND recurringPayment.account = :specifiedAccount', { type, specifiedAccount });
            }
            if(categoryName) {
                query.andWhere('recurringPayment.category = :categoryId AND recurringPayment.account = :specifiedAccount', { categoryId, specifiedAccount });
            }
            if(amountFrom && amountTo) {
                query.andWhere('recurringPayment.amount >= :amountFrom AND recurringPayment.amount <= :amountTo AND recurringPayment.account = :specifiedAccount', { amountFrom, amountTo, specifiedAccount });
            }
            if(dateFrom && dateTo) {
                query.andWhere('recurringPayment.date BETWEEN :dateFrom AND :dateTo AND recurringPayment.account = :specifiedAccount', { dateFrom, dateTo, specifiedAccount });
            }
            if(tag) {
                query.andWhere('recurringPayment.tag LIKE :tag AND recurringPayment.account = :specifiedAccount', { tag: `%${tag}%`, specifiedAccount });
            }    
        }
        
        const recurringPayments = await query.getMany();
        return recurringPayments;
    }
    
}
