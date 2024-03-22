import { Module } from '@nestjs/common';
import { WishListService } from './service/wish-list.service';
import { WishListController } from './controller/wish-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WishList, WishListSchema } from './model/wish-list.model';

@Module({
  controllers: [WishListController],
  providers: [WishListService],
  exports: [WishListService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: WishList.name, useFactory: () => WishListSchema },
    ]),
  ],
})
export class WishListModule {}
