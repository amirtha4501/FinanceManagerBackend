import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTransferDto } from "../dto/create-transfer.dto";
import { FilterTransferDto } from "../dto/filter-transfer.dto";
import { Transfer } from "../entity/transfer.entity";

@EntityRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {

    async createTransfer(createTransferDto: CreateTransferDto, accounts): Promise<Transfer> {

        const { amount, title, date, from_account_id, to_account_id } = createTransferDto;
        var fromAccount;
        var toAccount;
              
        if(from_account_id == to_account_id) {
            throw new BadRequestException("From and to account should not be same");
        }

        for(let account of accounts) {
            if(account.id == from_account_id) {
                fromAccount = account;
            }
            if(account.id == to_account_id) {
                toAccount = account;
            }
        }

        const transfer = new Transfer(); 
        
        transfer.amount = amount;  
        // transfer.title = title;
        transfer.transferred_amount = amount;
        transfer.date = date;

        if(fromAccount && toAccount) {
            transfer.from_account = fromAccount.id;  
            transfer.to_account = toAccount.id;
            
            fromAccount.current_amount -= amount;              
            toAccount.current_amount = +toAccount.current_amount + +amount;
        } else {
            if(!fromAccount) {
                throw new BadRequestException("From account id does not exist");
            }
            if(!toAccount) {
                throw new BadRequestException("To account id does not exist");
            }
        }

        await fromAccount.save();
        await toAccount.save();
        await transfer.save();

        return transfer;
    }

    async getTransfers(filterTransferDto: FilterTransferDto, accounts): Promise<Transfer[]> {
        const { specifiedAccount, dateFrom, dateTo, amountFrom, amountTo } = filterTransferDto;
        const query = this.createQueryBuilder('transfer')
                                .leftJoinAndSelect("transfer.from_account", "from_account")
                                .leftJoinAndSelect("transfer.to_account", "to_account")
        var ids: number[] = [];
        
        for(let account of accounts) {
            ids.push(account.id);
        }

        if( !amountFrom && !amountTo && !dateFrom && !dateTo ) {
            query.where('transfer.fromAccountId IN (:...ids) OR transfer.toAccountId IN (:...ids)', { ids });
        }

        if(!specifiedAccount) {
            if(amountFrom && amountTo) {
                query.andWhere('transfer.amount >= :amountFrom AND transfer.amount <= :amountTo AND transfer.fromAccountId IN (:...ids)', { amountFrom, amountTo, ids });
            }
            if(dateFrom && dateTo) {
                query.andWhere('transfer.date BETWEEN :dateFrom AND :dateTo AND transfer.fromAccountId IN (:...ids)', { dateFrom, dateTo, ids });
            }
        }

        if(specifiedAccount) {
            query.where('transfer.fromAccountId = :specifiedAccount OR transfer.toAccountId = :specifiedAccount', { specifiedAccount });
        }
        
        const transfers = await query.getMany();
        return transfers;
    }
}
