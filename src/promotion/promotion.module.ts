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
// import { JobService } from '../job/service/job.service';
// import { Job, JobSchema } from '../job/model/job.model';

@Module({
  controllers: [PromotionController],
  providers: [
    PromotionService,
    AccountPromotionService,
    PromotionConfigurationService,
    // JobService,
  ],
  imports: [
    TalentModule,
    AdsModule,
    JobModule,
    MongooseModule.forFeatureAsync([
      { name: Promotion.name, useFactory: () => PromotionSchema },
      { name: AccountPromotion.name, useFactory: () => AccountPromotionSchema },
      // { name: Job.name, useFactory: () => JobSchema },
    ]),
  ],
})
export class PromotionModule {}
