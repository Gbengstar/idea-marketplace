import { Module } from '@nestjs/common';
import { AdsService } from './service/ads.service';
import { AdsController } from './controller/ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads, AdsSchema } from './model/ads.model';

@Module({
  controllers: [AdsController],
  providers: [AdsService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Ads.name, useFactory: () => AdsSchema },
    ]),
  ],
})
export class AdsModule {}
