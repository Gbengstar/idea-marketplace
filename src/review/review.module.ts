import { Module } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './model/review.model';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Review.name, useFactory: () => ReviewSchema },
    ]),
  ],
})
export class ReviewModule {}
