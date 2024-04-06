import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { Review } from '../model/review.model';
import { PipelineStage } from 'mongoose';
import { GetItemReviewsDto } from '../dto/review.dto';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createReviewValidator,
  searchReviewValidator,
} from '../validator/review.validator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  createReview(
    @TokenDecorator() { id }: TokenDataDto,
    @Body(new ObjectValidationPipe(createReviewValidator)) review: Review,
  ) {
    review.account = id;
    return this.reviewService.create(review);
  }

  @Get()
  getItemReview(
    @Query(new ObjectValidationPipe(searchReviewValidator))
    { limit, page, ...review }: GetItemReviewsDto,
  ) {
    const pipeline: PipelineStage[] = [{ $match: review }];
    return this.reviewService.aggregatePaginationSum(
      { limit, page },
      pipeline,
      'rating',
    );
  }
}
