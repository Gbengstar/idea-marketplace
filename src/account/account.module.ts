import { Module } from '@nestjs/common';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './model/account.model';
import { GoogleStrategyService } from '../../libs/utils/src/auth-strategy/service/google-strategy.service';
import { FileUploadModule } from '../../libs/utils/src/file-upload/file-upload.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService, GoogleStrategyService],
  exports: [AccountService],
  imports: [
    FileUploadModule,
    MongooseModule.forFeatureAsync([
      { name: Account.name, useFactory: () => AccountSchema },
    ]),
  ],
})
export class AccountModule {}
