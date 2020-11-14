import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Transfer } from './transfer.entity';
import { TransferRepository } from './transfer.repository';

@Injectable()
export class TransfersService {
    
    constructor(
        @InjectRepository(TransferRepository)
        private transferRepository: TransferRepository
    ) {}

    async createTransfer(
        createTransferDto: CreateTransferDto,
        accounts: Account
    ): Promise<Transfer> {
        return this.transferRepository.createTransfer(createTransferDto, accounts);
    }
    
    async getTransferById(id: number, accounts): Promise<Transfer> {
        var transferIds: number[] = [];
        
        for(let account of accounts) {
            for(let transfer of account.transfers_from) {
                transferIds.push(transfer.id);
            }
            for(let transfer of account.transfers_to) {
                transferIds.push(transfer.id);
            }
        }

        if(transferIds.includes(id)) {
            const found = await this.transferRepository.findOne(id);
            if(!found) {
                throw new NotFoundException(`Transfer with ID '${id}' not found`);
            }
            return found
        } else {
            throw new BadRequestException("Transfer id is not exists");
        }
    }

    async getTransfers( 
        filterTransferDto: FilterTransferDto,
        accounts: Account
    ): Promise<Transfer[]> {
        return this.transferRepository.getTransfers(filterTransferDto, accounts);
    }

    async updateTransfer(id: number, updateTransferDto: UpdateTransferDto, accounts): Promise<Transfer> {
        const transfer = await this.getTransferById(id, accounts);
        const { amount, date, from_account_id, to_account_id } = updateTransferDto;
        var fromAccount;
        var toAccount;

        if(from_account_id == to_account_id) {
            throw new BadRequestException("From and to account id should not be same");
        }

        for(let account of accounts) {
            if(account.id == from_account_id) {
                fromAccount = account;
            }
            if(account.id == to_account_id) {
                toAccount = account;
            }
        }
        
        transfer.amount = amount;  
        transfer.date = date;

        transfer.transferred_amount;
        transfer.from_account;
        console.log(transfer.to_account);

        if(fromAccount && toAccount) {
            transfer.from_account = fromAccount;
            transfer.to_account = toAccount; 

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

    async deleteTransfer(id: number, accounts) {
        var transferIds: number[] = [];
        
        for(let account of accounts) {
            for(let transfer of account.transfers_from) {
                transferIds.push(transfer.id);
            }
            for(let transfer of account.transfers_to) {
                transferIds.push(transfer.id);
            }
        }

        if(transferIds.includes(id)) {

            const result = await this.transferRepository.delete(id);
            
            if(result.affected === 0) {
                throw new NotFoundException(`Transfer not found to delete`);
            }
        } else {
            throw new BadRequestException("Transfer id not exists");
        }
    }
}
