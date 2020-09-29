import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { CreateRecurringPaymentDto } from './dto/create-recurring-payment.dto';
import { FilterRecurringPaymentsDto } from './dto/filter-recurring-payment';
import { UpdateRecurringPaymentDto } from './dto/update-recurring-payment.dto';
import { RecurringPayment } from './recurring-payment.entity';
import { RecurringPaymentRepository } from './recurring-payment.repository';

@Injectable()
export class RecurringPaymentsService {

    constructor(
        @InjectRepository(RecurringPaymentRepository)
        private recurringPaymentRepository: RecurringPaymentRepository
    ) {}

    async createRecurringPayment(
        createRecurringPaymentDto: CreateRecurringPaymentDto,
        accounts: Account,
        categories: Category
    ): Promise<RecurringPayment> {
        return this.recurringPaymentRepository.createRecurringPayment(createRecurringPaymentDto, accounts, categories);
    }

    async getRecurringPaymentById(id: number, accounts): Promise<RecurringPayment> {
        var recurringPaymentIds: number[] = [];
        
        for(let account of accounts) {
            for(let recurringPayment of account.recurringPayments) {
                recurringPaymentIds.push(recurringPayment.id);
            }
        }

        if(recurringPaymentIds.includes(id)) {
            const found = await this.recurringPaymentRepository.findOne(id);
            if(!found) {
                throw new NotFoundException(`RecurringPayment with ID '${id}' not found`);
            }
            return found
        } else {
            throw new BadRequestException("RecurringPayment id is not exists in the user accounts");
        }
    }

    async getRecurringPayments(
        filterRecurringPaymentsDto: FilterRecurringPaymentsDto,
        accounts: Account,
        categories: Category
    ): Promise<RecurringPayment[]> {
        return this.recurringPaymentRepository.getRecurringPayments(filterRecurringPaymentsDto, accounts, categories);
    }

    async updateRecurringPayment(id: number, updateRecurringPaymentDto: UpdateRecurringPaymentDto, accounts, categories): Promise<RecurringPayment> {
        const recurringPayment = await this.getRecurringPaymentById(id, accounts);
        const { amount, type, title, note, tag, date, start_date, end_date, frequency, category_id, account_id } = updateRecurringPaymentDto;
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
        // console.log(new Date().getUTCDate());
        recurringPayment.amount = amount;
        recurringPayment.type = type;
        recurringPayment.title = title;
        recurringPayment.note = note;
        recurringPayment.tag = tag;
        recurringPayment.date = date;
        recurringPayment.start_date = start_date;
        recurringPayment.end_date = end_date;
        recurringPayment.frequency = frequency;
        
        if(currentCategory) {
            recurringPayment.category = currentCategory;
        } else {
            throw new BadRequestException("Category does not exists");
        }
        if(currentAccount) {
            recurringPayment.account = currentAccount;
        } else {
            throw new BadRequestException("recurringPayment does not exist in the user account");
        }

        await recurringPayment.save();
        return recurringPayment;
    }

    async deleteRecurringPayment(id: number, accounts): Promise<void> {
        var recurringPaymentIds: number[] = [];
        
        for(let account of accounts) {
            for(let recurringPayment of account.recurringPayments) {
                recurringPaymentIds.push(recurringPayment.id);
            }
        }

        if(recurringPaymentIds.includes(id)) {
            const result = await this.recurringPaymentRepository.delete(id);
            
            if(result.affected === 0) {
                throw new NotFoundException(`RecurringPayment not found to delete`);
            }
        } else {
            throw new BadRequestException("RecurringPayment id is not exists in the user accounts");
        }
        
    }
}
