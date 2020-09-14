import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
    
    constructor(
        private accountsService: AccountsService
    ) {}
    
    @Post()
    @UsePipes(ValidationPipe)
    createAccount(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountsService.createAccount(createAccountDto);
    }
    
    @Get('/:id')
    getAccountById(@Param('id', ParseIntPipe) id: number): Promise<Account> {
        return this.accountsService.getAccountById(id);
    }

    // modify later
    @Get('/user/:id')
    getAccounts(@Param('id', ParseIntPipe) user_id: number): Promise<Account[]> {
        return this.accountsService.getAccounts(user_id);
    }

    @Patch('/:id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateAccountDto: UpdateAccountDto)
    : Promise<Account> {
        return this.accountsService.updateAccount(id, updateAccountDto);
    }
    
    @Delete('/:id') 
    deleteTransaction(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.accountsService.deleteAccount(id);
    }
   
}
