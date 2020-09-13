import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(AccountRepository)
        private accountRepository: AccountRepository
    ) {}

    async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
        return this.accountRepository.createAccount(createAccountDto);
    }
    
    async getAccountById(id: number): Promise<Account> {
        const found = await this.accountRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Account with ID '${id}' not found`);
        }

        return found;
    }
   
    // modify later
    async getAccounts(user_id: number): Promise<Account[]> {
        return this.accountRepository.getAccounts(user_id);
    }

    async updateAccount(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
        const account = await this.getAccountById(id);
        const { current_amount, date, account_name } = updateAccountDto;

        account.current_amount = current_amount;
        account.date = date;
        account.account_name = account_name;

        await account.save();
        return account;
    }
    
    async deleteAccount(id: number): Promise<void> {
        const result = await this.accountRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Account not found to delete`);
        }
    }
   
}
