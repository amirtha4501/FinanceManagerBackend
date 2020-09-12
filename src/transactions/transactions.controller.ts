import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionsService.createTransaction(createTransactionDto);
    }

    @Get('/:id')
    getTransactionById(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
        return this.transactionsService.getTransactionById(id);
    }

    @Get()
    getTransactions(@Query(ValidationPipe) filterTransactionsDto: FilterTransactionsDto): Promise<Transaction[]> {
        return this.transactionsService.getTransactions(filterTransactionsDto);
    }
   
    @Patch('/:id')
    updateTransaction(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTransactionDto: UpdateTransactionDto)
    : Promise<Transaction> {
        return this.transactionsService.updateTransaction(id, updateTransactionDto);
    }

    @Delete('/:id') 
    deleteTransaction(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.transactionsService.deleteTransaction(id);
    }
}
