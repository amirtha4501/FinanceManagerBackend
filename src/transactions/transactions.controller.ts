import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction, Type } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transactions.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createTransactions(@Body() createTransactionDto: CreateTransactionDto): Transaction {
        return this.transactionsService.createTransactions(createTransactionDto);
    }

    @Get('/:id')
    getTransactionById(@Param('id') id: number): Transaction {
        return this.transactionsService.getTransactionById(id);
    }

    @Get()
    getTransactions(@Query() filterTransactionDto: FilterTransactionDto): Transaction[] {
        console.log(filterTransactionDto);
        if(Object.keys(filterTransactionDto).length) {
            return this.transactionsService.getFilteredTransactions(filterTransactionDto);
        } else {
            return this.transactionsService.getAllTransactions();
        }
    }

    @Patch('/:id')
    updateTransaction(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTransactionDto: UpdateTransactionDto)
    : Transaction {
        return this.transactionsService.updateTransaction(id, updateTransactionDto);
    }

    @Delete('/:id') 
    deleteTransaction(@Param('id', ParseIntPipe) id: number): void {
        this.transactionsService.deleteTransaction(id);
    }
}
