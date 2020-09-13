import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Account } from "./account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {

    async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
        const { account_name, user_id } = createAccountDto;

        const account = new Account();

        account.account_name = account_name;
        account.user_id = user_id;

        try {
            await account.save();
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException("account_name already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }
        return account;
    }

    // modify later
    async getAccounts(user_id: number): Promise<Account[]> {
        const query = this.createQueryBuilder('account');
        
        query.andWhere('account.user_id = :user_id', { user_id });
       
        const accounts = await query.getMany();
        return accounts;
    }
}