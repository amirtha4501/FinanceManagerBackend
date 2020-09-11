import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Type } from '../type.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transactions.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createTransactions(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionsService.createTransactions(createTransactionDto);
    }

    @Get('/:id')
    getTransactionById(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
        return this.transactionsService.getTransactionById(id);
    }

    // @Get()
    // getTransactions(@Query() filterTransactionDto: FilterTransactionDto): Transaction[] {
    //     console.log(filterTransactionDto);
    //     if(Object.keys(filterTransactionDto).length) {
    //         return this.transactionsService.getFilteredTransactions(filterTransactionDto);
    //     } else {
    //         return this.transactionsService.getAllTransactions();
    //     }
    // }

    // @Patch('/:id')
    // updateTransaction(
    //     @Param('id', ParseIntPipe) id: number, 
    //     @Body() updateTransactionDto: UpdateTransactionDto)
    // : Transaction {
    //     return this.transactionsService.updateTransaction(id, updateTransactionDto);
    // }

    // @Delete('/:id') 
    // deleteTransaction(@Param('id', ParseIntPipe) id: number): void {
    //     this.transactionsService.deleteTransaction(id);
    // }
}
