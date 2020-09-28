import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { FilterTransferDto } from "./dto/filter-transfer.dto";
import { Transfer } from "./transfer.entity";

@EntityRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {

    async createTransfer(createTransferDto: CreateTransferDto, accounts): Promise<Transfer> {

        const { amount, date, from_account_id, to_account_id } = createTransferDto;
        var fromAccount;
        var toAccount;
        
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
        transfer.date = date;

        if(fromAccount && toAccount) {
            transfer.from_account = fromAccount.id;  
            transfer.to_account = toAccount.id;
        } else {
            throw new BadRequestException("Account does not exist in the user account");
        }
        
        await transfer.save();

        return transfer;
    }

    async getTransfers(filterTransferDto: FilterTransferDto, accounts): Promise<Transfer[]> {
        const { specifiedAccount, dateFrom, dateTo, amountFrom, amountTo } = filterTransferDto;
        const query = this.createQueryBuilder('transfer');
        var ids: number[] = [];
        
        for(let account of accounts) {
            ids.push(account.id);
        }

        if( !amountFrom && !amountTo && !dateFrom && !dateTo ) {
            query.where('transfer.from_account_id IN (:...ids) OR transfer.to_account_id IN (:...ids)', { ids });
        }

        if(!specifiedAccount) {
            if(amountFrom && amountTo) {
                query.andWhere('transfer.amount >= :amountFrom AND transfer.amount <= :amountTo AND transfer.from_account_id IN (:...ids)', { amountFrom, amountTo, ids });
            }
            if(dateFrom && dateTo) {
                query.andWhere('transfer.date BETWEEN :dateFrom AND :dateTo AND transfer.from_account_id IN (:...ids)', { dateFrom, dateTo, ids });
            }
        }

        if(specifiedAccount) {
            query.where('transfer.from_account_id = :specifiedAccount OR transfer.to_account_id = :specifiedAccount', { specifiedAccount });
        }
        
        const transfers = await query.getMany();
        return transfers;
    }
}
