import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from 'src/accounts/get-account.decorator';
import { Category } from 'src/categories/category.entity';
import { GetCategory } from 'src/categories/get-category.decorator';
import { CreateRecurringPaymentDto } from './dto/create-recurring-payment.dto';
import { FilterRecurringPaymentsDto } from './dto/filter-recurring-payment';
import { UpdateRecurringPaymentDto } from './dto/update-recurring-payment.dto';
import { RecurringPayment } from './recurring-payment.entity';
import { RecurringPaymentsService } from './recurring-payments.service';

@Controller('recurring-payments')
@UseGuards(AuthGuard())
export class RecurringPaymentsController {

    constructor(private recurringPaymentService: RecurringPaymentsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createRecurringPayment(
        @Body() createRecurringPaymentDto: CreateRecurringPaymentDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<RecurringPayment> {
        return this.recurringPaymentService.createRecurringPayment(createRecurringPaymentDto, accounts, categories);
    }

    @Get('/:id')
    async getRecurringPaymentById(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
        ): Promise<RecurringPayment> {
        return this.recurringPaymentService.getRecurringPaymentById(id, accounts);
    }

    @Get()
    async getRecurringPayments(
        @Query(ValidationPipe) filterRecurringPaymentsDto: FilterRecurringPaymentsDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<RecurringPayment[]> {
        return this.recurringPaymentService.getRecurringPayments(filterRecurringPaymentsDto, accounts, categories);
    }

    @Patch('/:id')
    updateRecurringPayment(
        @Param('id', ParseIntPipe) id: number, 
        @Body(ValidationPipe) updateRecurringPaymentDto: UpdateRecurringPaymentDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
        ): Promise<RecurringPayment> {
        return this.recurringPaymentService.updateRecurringPayment(id, updateRecurringPaymentDto, accounts, categories);
    }
    
    @Delete('/:id') 
    deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ): Promise<void> {
        return this.recurringPaymentService.deleteRecurringPayment(id, accounts);
    }
}
