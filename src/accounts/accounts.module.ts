import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccountRepository } from './account.repository';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    AuthModule
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}
