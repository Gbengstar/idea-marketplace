import { Module } from '@nestjs/common';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './model/account.model';
import { GoogleStrategyService } from '../../libs/utils/src/auth-strategy/service/google-strategy.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, GoogleStrategyService],
  exports: [AccountService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Account.name, useFactory: () => AccountSchema },
    ]),
  ],
})
export class AccountModule {}
