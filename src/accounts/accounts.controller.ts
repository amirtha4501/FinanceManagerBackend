import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountsController {
    
    constructor(
        private accountsService: AccountsService
    ) {}
    
    @Post()
    @UsePipes(ValidationPipe)
    createAccount(
        @Body() createAccountDto: CreateAccountDto,
        @GetUser() user: User    
    ): Promise<Account> {
        console.log(user, "he");
        return this.accountsService.createAccount(createAccountDto, user);
    }
    
    @Get('/:id')
    getAccountById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User    
    ): Promise<Account> {
        return this.accountsService.getAccountById(id, user);
    }

    @Get()
    getAccounts(
        @GetUser() user: User    
        ): Promise<Account[]> {
        return this.accountsService.getAccounts(user);
    }

    @Patch('/:id')
    updateAccount(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateAccountDto: UpdateAccountDto,
        @GetUser() user: User    
    ): Promise<Account> {
        return this.accountsService.updateAccount(id, updateAccountDto, user);
    }
    
    @Delete('/:id') 
    deleteTransaction(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User    
    ): Promise<void> {
        return this.accountsService.deleteAccount(id, user);
    }
   
}
