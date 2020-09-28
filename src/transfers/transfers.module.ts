import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferRepository } from './transfer.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransferRepository]),
    AuthModule
  ],
  controllers: [TransfersController],
  providers: [TransfersService]
})
export class TransfersModule {}
