import { Module } from '@nestjs/common';
import { AdsService } from './service/ads.service';
import { AdsController } from './controller/ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads, AdsSchema } from './model/ads.model';
import { WishListModule } from '../wish-list/wish-list.module';
import { FollowService } from '../follow/service/follow.service';
import { Follow, FollowSchema } from '../follow/model/follow.model';
import { FileUploadModule } from '../../libs/utils/src/file-upload/file-upload.module';
import { StoreService } from '../store/service/store.service';
import { Store, StoreSchema } from '../store/model/store.model';

@Module({
  controllers: [AdsController],
  providers: [AdsService, FollowService, StoreService],
  exports: [AdsService],
  imports: [
    WishListModule,
    FileUploadModule,
    MongooseModule.forFeatureAsync([
      { name: Ads.name, useFactory: () => AdsSchema },
      { name: Follow.name, useFactory: () => FollowSchema },
      { name: Store.name, useFactory: () => StoreSchema },
    ]),
  ],
})
export class AdsModule {}
