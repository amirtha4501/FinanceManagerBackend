import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Account } from "../entity/account.entity";
import { CreateAccountDto } from "../dto/create-account.dto";

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {

    async createAccount(
        createAccountDto: CreateAccountDto,
        user: User
    ): Promise<Account> {

        const { name, current_amount, date } = createAccountDto;

        const account = new Account();

        account.user = user;
        account.current_amount = current_amount;
        
        if(date) {
            account.date = date;
        }

        if(!await this.findOne({where: {name: name, user: user}})) {
            account.name = name;
        } else {
            throw new ConflictException("account name already exists");
        }
        
        try {
            await account.save();
            delete account.user; 
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return account;
    }

    async getAccounts(user: User): Promise<Account[]> {
        const query = this.createQueryBuilder('account');
        
        const userId = user.id;
        query.andWhere('account.user = :userId', { userId });
       
        const accounts = await query.getMany();
        return accounts;
    }
}
