import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { Review } from '../model/review.model';
import { FilterQuery, Types } from 'mongoose';
import { GetItemReviewsDto, ReplyReviewsDto } from '../dto/review.dto';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createReviewValidator,
  replyReviewValidator,
  searchReviewValidator,
} from '../validator/review.validator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { AdsService } from '../../ads/service/ads.service';
import { CommentService } from '../service/comment.service';

@Controller('review')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(
    private readonly reviewService: ReviewService,
    private readonly adsService: AdsService,
    private readonly commentService: CommentService,
  ) {}

  @Post('ads')
  async createReview(
    @TokenDecorator() { id }: TokenDataDto,
    @Body(new ObjectValidationPipe(createReviewValidator)) review: Review,
  ) {
    const ads = await this.adsService.findByIdOrErrorOut(review.item);

    if (ads.account.toString() === id) {
      throw new BadRequestException('you are not allowed to review your ads');
    }

    this.logger.log({ account: ads.account, id });

    const comment = new this.commentService.model({
      account: id,
      comment: review.comment,
    });
    review.reviewer = id;
    review.comment = comment._id.toString();

    review.account = ads.account;
    const [newReview] = await Promise.all([
      this.reviewService.create(review),
      comment.save(),
    ]);
    return newReview.populate([
      { path: 'comment' },
      { path: 'item', model: 'Ads' },
    ]);
  }

  @Post('ads/reply')
  async replyReview(
    @TokenDecorator() { id }: TokenDataDto,
    @Body(new ObjectValidationPipe(replyReviewValidator))
    reply: ReplyReviewsDto,
  ) {
    const review = await this.reviewService.findByIdOrErrorOut(reply.id);
    const comment = new this.commentService.model({
      account: id,
      comment: reply.comment,
    });
    review.reply = comment._id.toString();

    if (review.account.toString() !== id) {
      throw new BadRequestException('you can only reply to review of your ads');
    }

    const [newReview] = await Promise.all([review.save(), comment.save()]);

    return newReview.populate([
      { path: 'comment reply' },
      { path: 'item', model: 'Ads' },
    ]);
  }

  @Get()
  getItemReview(
    @Query(new ObjectValidationPipe(searchReviewValidator))
    { limit, page, ...review }: GetItemReviewsDto,
  ) {
    const filter: FilterQuery<Review> = {};

    if ('reviewer' in review)
      filter.reviewer = new Types.ObjectId(review.reviewer);
    if ('account' in review)
      filter.account = new Types.ObjectId(review.account);

    if ('item' in review) filter.item = new Types.ObjectId(review.item);

    if ('id' in review) filter._id = new Types.ObjectId(review.id);

    return this.reviewService.paginatedResultAverage(
      { limit, page },
      filter,
      'rating',
      { createdAt: -1 },
      [{ path: 'account reviewer comment reply' }],
    );
  }
}
