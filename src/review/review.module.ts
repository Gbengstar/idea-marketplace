import { Module } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './model/review.model';
import { Comment, CommentSchema } from './model/comment.model';
import { CommentService } from './service/comment.service';
import { AdsService } from '../ads/service/ads.service';
import { Ads, AdsSchema } from '../ads/model/ads.model';
import { TalentService } from '../talent/service/talent.service';
import { Talent, TalentSchema } from '../talent/model/talent.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, CommentService, AdsService, TalentService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Review.name, useFactory: () => ReviewSchema },
      { name: Comment.name, useFactory: () => CommentSchema },
      { name: Ads.name, useFactory: () => AdsSchema },
      { name: Talent.name, useFactory: () => TalentSchema },
    ]),
  ],
})
export class ReviewModule {}
