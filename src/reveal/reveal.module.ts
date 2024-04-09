import { Module } from '@nestjs/common';
import { RevealService } from './service/reveal.service';
import { RevealController } from './controller/reveal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RevealLog, RevealLogSchema } from './model/reveal.model';
import { AccountService } from '../account/service/account.service';
import { Account, AccountSchema } from '../account/model/account.model';

@Module({
  controllers: [RevealController],
  providers: [RevealService, AccountService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: RevealLog.name, useFactory: () => RevealLogSchema },
      { name: Account.name, useFactory: () => AccountSchema },
    ]),
  ],
})
export class RevealModule {}
