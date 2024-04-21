import { Module } from '@nestjs/common';
import { AdsService } from './service/ads.service';
import { AdsController } from './controller/ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads, AdsSchema } from './model/ads.model';
import { WishListModule } from '../wish-list/wish-list.module';
import { FollowService } from '../follow/service/follow.service';
import { Follow, FollowSchema } from '../follow/model/follow.model';

@Module({
  controllers: [AdsController],
  providers: [AdsService, FollowService],
  exports: [AdsService],
  imports: [
    WishListModule,
    MongooseModule.forFeatureAsync([
      { name: Ads.name, useFactory: () => AdsSchema },
      { name: Follow.name, useFactory: () => FollowSchema },
    ]),
  ],
})
export class AdsModule {}
