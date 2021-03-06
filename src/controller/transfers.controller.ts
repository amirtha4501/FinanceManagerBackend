import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from 'src/decorator/get-account.decorator';
import { Account } from 'src/entity/account.entity';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { FilterTransferDto } from '../dto/filter-transfer.dto';
import { UpdateTransferDto } from '../dto/update-transfer.dto';
import { Transfer } from '../entity/transfer.entity';
import { TransfersService } from '../service/transfers.service';

@Controller('transfers')
@UseGuards(AuthGuard())
export class TransfersController {
    constructor(private transferService: TransfersService) {}

    @Post()
    @UsePipes(ValidationPipe) 
    createTransfer(
        @Body() createTransferDto: CreateTransferDto,
        @GetAccount() accounts: Account
    ): Promise<Transfer> {
        return this.transferService.createTransfer(createTransferDto, accounts);
    }

    @Get('/:id')
    getTransferById(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ): Promise<Transfer> {
        return this.transferService.getTransferById(id, accounts);
    }

    @Get()
    getTransfers(
        @Query(ValidationPipe) filterTransferDto: FilterTransferDto,
        @GetAccount() accounts: Account
    ) {
        return this.transferService.getTransfers(filterTransferDto, accounts);
    }
   
    @Patch('/:id')
    updateTransfer(
        @Param('id', ParseIntPipe) id: number, 
        @Body(ValidationPipe) updateTransferDto: UpdateTransferDto,
        @GetAccount() accounts: Account
    ): Promise<Transfer> {
        return this.transferService.updateTransfer(id, updateTransferDto, accounts);
    }

    @Delete('/:id') 
    deleteTransfer(
        @Param('id', ParseIntPipe) id: number,
        @GetAccount() accounts: Account
    ) {
        return this.transferService.deleteTransfer(id, accounts);
    }
}
