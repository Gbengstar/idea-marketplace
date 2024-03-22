import { Module } from '@nestjs/common';
import { PromotionService } from './service/promotion.service';
import { PromotionController } from './controller/promotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './model/promotion.model';
import {
  AccountPromotion,
  AccountPromotionSchema,
} from './model/account-promotion.model';
import { AccountPromotionService } from './service/account-promotion.service';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, AccountPromotionService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Promotion.name, useFactory: () => PromotionSchema },
      { name: AccountPromotion.name, useFactory: () => AccountPromotionSchema },
    ]),
  ],
})
export class PromotionModule {}
