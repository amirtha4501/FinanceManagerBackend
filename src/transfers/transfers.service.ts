import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAccountDto } from 'src/accounts/dto/update-account.dto';
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
            console.log(account);
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
            throw new BadRequestException("Transfer id is not exists in the user accounts");
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

        if(fromAccount && toAccount) {
            transfer.from_account = fromAccount;
            transfer.to_account = toAccount;
        } else {
            throw new BadRequestException("Transfer does not exist in the user account");
        }

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
            throw new BadRequestException("Transfer id is not exists in the user accounts");
        }
    }
}
