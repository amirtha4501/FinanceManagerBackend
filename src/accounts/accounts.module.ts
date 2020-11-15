import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccountRepository } from '../repository/account.repository';
import { AccountsController } from '../controller/accounts.controller';
import { AccountsService } from '../service/accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    AuthModule
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}
