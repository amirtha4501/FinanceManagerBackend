import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AccountsController } from './controller/accounts.controller';
import { AuthController } from './controller/auth.controller';
import { CategoriesController } from './controller/categories.controller';
import { TransactionsController } from './controller/transactions.controller';
import { TransfersController } from './controller/transfers.controller';
import { AccountsService } from './service/accounts.service';
import { AuthService } from './service/auth.service';
import { CategoriesService } from './service/categories.service';
import { TransactionsService } from './service/transactions.service';
import { TransfersService } from './service/transfers.service';
import { AccountRepository } from './repository/account.repository';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { CategoryRepository } from './repository/category.repository';
import { TransactionRepository } from './repository/transaction.repository';
import { TransferRepository } from './repository/transfer.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'password', // JWT Password
      signOptions: {
        expiresIn: 86400,
      }
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      AccountRepository,
      UserRepository,
      CategoryRepository,
      TransactionRepository,
      TransferRepository
    ]),
  ],
  controllers: [
    AccountsController,
    AuthController,
    CategoriesController,
    TransactionsController,
    TransfersController
  ],
  providers: [
    AccountsService,
    AuthService,
    CategoriesService,
    TransactionsService,
    TransfersService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AppModule {}
