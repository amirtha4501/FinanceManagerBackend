import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { Transaction } from './transaction.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from 'src/accounts/get-account.decorator';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createTransaction(
        @Body() createTransactionDto: CreateTransactionDto,
        @GetAccount() accounts: Account
    ): Promise<Transaction> {
        return this.transactionsService.createTransaction(createTransactionDto, accounts);
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
        @GetAccount() accounts: Account
    ): Promise<Transaction[]> {
        return this.transactionsService.getTransactions(filterTransactionsDto, accounts);
    }
   
    @Patch('/:id')
    updateTransaction(
        @Param('id', ParseIntPipe) id: number, 
        @Body(ValidationPipe) updateTransactionDto: UpdateTransactionDto,
        @GetAccount() accounts: Account
    ): Promise<Transaction> {
        return this.transactionsService.updateTransaction(id, updateTransactionDto, accounts);
    }

    @Delete('/:id') 
    deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ): Promise<void> {
        return this.transactionsService.deleteTransaction(id, accounts);
    }
}
