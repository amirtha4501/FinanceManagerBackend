import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from '../repository/account.repository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account } from '../entity/account.entity';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(AccountRepository)
        private accountRepository: AccountRepository
    ) {}

    temp() {
        console.log("Account service temp method");
    }

    async createAccount(
        createAccountDto: CreateAccountDto,
        user: User
    ): Promise<Account> {
        return this.accountRepository.createAccount(createAccountDto, user);
    }
    
    async getAccountById(
        id: number,
        user: User
    ): Promise<Account> {
        const found = await this.accountRepository.findOne({ where: { user: user, id: id } });

        if(!found) {
            throw new NotFoundException(`Account with ID '${id}' not found`);
        }

        return found;
    }
   
    async getAccounts(user: User): Promise<Account[]> {
        return this.accountRepository.getAccounts(user);
    }

    async updateAccount(id: number, updateAccountDto: UpdateAccountDto, user: User): Promise<Account> {
        const account = await this.getAccountById(id, user);
        const { current_amount, date, name } = updateAccountDto;

        if(!await this.accountRepository.findOne({where: {name: name, user: user}})) {
            account.name = name;
        } else {
            throw new ConflictException("Account name already exists");
        }

        account.current_amount = current_amount;
        account.date = date;

        await account.save();
        return account;
    }
    
    async deleteAccount(id: number, user: User): Promise<void> {
        const account = await this.getAccountById(id, user);
        const result = await this.accountRepository.delete(account.id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Account with ID '${id} not found to delete`);
        }
    }
   
}
