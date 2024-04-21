import { Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { StoreController } from './controller/store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './model/store.model';
import { AccountModule } from '../account/account.module';
import { FollowService } from '../follow/service/follow.service';
import { Follow, FollowSchema } from '../follow/model/follow.model';

@Module({
  controllers: [StoreController],
  providers: [StoreService, FollowService],
  imports: [
    AccountModule,
    MongooseModule.forFeatureAsync([
      { name: Store.name, useFactory: () => StoreSchema },
      { name: Follow.name, useFactory: () => FollowSchema },
    ]),
  ],
})
export class StoreModule {}
