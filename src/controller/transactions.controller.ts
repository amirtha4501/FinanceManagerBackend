import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { Transaction } from '../entity/transaction.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from 'src/decorator/get-account.decorator';
import { GetCategory } from 'src/decorator/get-category.decorator';
import { Category } from 'src/entity/category.entity';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
    
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createTransaction(
        @Body() createTransactionDto: CreateTransactionDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<Transaction> {
        return this.transactionsService.createTransaction(createTransactionDto, accounts, categories);
    }

    @Get('/:id')
    getTransactionById(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ): Promise<Transaction> {
        return this.transactionsService.getTransactionById(id, accounts);
    }

    @Get()
    getTransactions(
        @Query(ValidationPipe) filterTransactionsDto: FilterTransactionsDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<Transaction[]> {
        return this.transactionsService.getTransactions(filterTransactionsDto, accounts, categories);
    }

    @Get('/review') 
    getTransactionsByCategory(
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<any> {
        return this.transactionsService.getTransactionsByCategory(accounts, categories);
    }

    @Get('/monthly-transactions') 
    getMonthlyTransactions(
        @GetAccount() accounts: Account
    ): Promise<Object[]> {
        return this.transactionsService.getMonthlyTransactions(accounts);
    }
    
    @Get('/reports')
    getReports(
        @GetAccount() accounts: Account
    ): Promise<Object> {
        return this.transactionsService.getReports(accounts);
    }

    @Patch('/:id')
    updateTransaction(
        @Param('id', ParseIntPipe) id: number, 
        @Body(ValidationPipe) updateTransactionDto: UpdateTransactionDto,
        @GetAccount() accounts: Account,
        @GetCategory() categories: Category
    ): Promise<Transaction> {
        return this.transactionsService.updateTransaction(id, updateTransactionDto, accounts, categories);
    }

    @Delete('/:id') 
    deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ): Promise<void> {
        return this.transactionsService.deleteTransaction(id, accounts);
    }
}
