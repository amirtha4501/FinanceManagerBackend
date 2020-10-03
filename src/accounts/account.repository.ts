import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Account } from "./account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {

    async createAccount(
        createAccountDto: CreateAccountDto,
        user: User
    ): Promise<Account> {

        const { name } = createAccountDto;

        const account = new Account();

        account.user = user;

        if(!await this.findOne({where: {name: name, user: user}})) {
            account.name = name;
        } else {
            throw new ConflictException("account name already exists");
        }

        console.log(user);
        
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
        
        console.log(user.id);
        const userId = user.id;
        query.andWhere('account.user = :userId', { userId });
       
        const accounts = await query.getMany();
        return accounts;
    }
}