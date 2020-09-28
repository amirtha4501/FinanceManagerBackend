import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { Transfer } from './transfer.entity';
import { TransferRepository } from './transfer.repository';

@Injectable()
export class TransfersService {
    
    constructor(
        @InjectRepository(TransferRepository)
        private transferRepository: TransferRepository
    ) {}

    async createTransfer(
        createTransactionDto: CreateTransferDto,
        accounts: Account
    ): Promise<Transfer> {
        return this.transferRepository.createTransfer(createTransactionDto, accounts);
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

}
