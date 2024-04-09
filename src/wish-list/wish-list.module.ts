import { Module } from '@nestjs/common';
import { WishListService } from './service/wish-list.service';
import { WishListController } from './controller/wish-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WishList, WishListSchema } from './model/wish-list.model';
import { AdsService } from '../ads/service/ads.service';
import { Ads, AdsSchema } from '../ads/model/ads.model';

@Module({
  controllers: [WishListController],
  providers: [WishListService, AdsService],
  exports: [WishListService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: WishList.name, useFactory: () => WishListSchema },
      { name: Ads.name, useFactory: () => AdsSchema },
    ]),
  ],
})
export class WishListModule {}
