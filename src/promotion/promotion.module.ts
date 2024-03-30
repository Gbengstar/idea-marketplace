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
import { PromotionConfigurationService } from './service/promotion-config.service';
import { TalentModule } from '../talent/talent.module';
import { AdsModule } from '../ads/ads.module';
import { JobModule } from '../job/job.module';

@Module({
  controllers: [PromotionController],
  providers: [
    PromotionService,
    AccountPromotionService,
    PromotionConfigurationService,
  ],
  imports: [
    TalentModule,
    AdsModule,
    JobModule,
    MongooseModule.forFeatureAsync([
      { name: Promotion.name, useFactory: () => PromotionSchema },
      { name: AccountPromotion.name, useFactory: () => AccountPromotionSchema },
    ]),
  ],
})
export class PromotionModule {}
