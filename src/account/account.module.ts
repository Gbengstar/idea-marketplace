import { Module } from '@nestjs/common';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './model/account.model';
import { GoogleStrategyService } from '../../libs/utils/src/auth-strategy/service/google-strategy.service';
import { FileUploadModule } from '../../libs/utils/src/file-upload/file-upload.module';
import { AdsModule } from '../ads/ads.module';
import { JobModule } from '../job/job.module';
import { TalentModule } from '../talent/talent.module';
import { Store, StoreSchema } from '../store/model/store.model';
import { StoreService } from '../store/service/store.service';
import { ResourceSearchController } from './controller/resource-search.controller';

@Module({
  controllers: [AccountController, ResourceSearchController],
  providers: [AccountService, GoogleStrategyService, StoreService],
  exports: [AccountService],
  imports: [
    FileUploadModule,
    AdsModule,
    JobModule,
    TalentModule,
    MongooseModule.forFeatureAsync([
      { name: Account.name, useFactory: () => AccountSchema },
      { name: Store.name, useFactory: () => StoreSchema },
    ]),
  ],
})
export class AccountModule {}
