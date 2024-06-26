import { ConfigurationService } from './../../configuration/service/configuration.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  NotAcceptableException,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { Review } from '../model/review.model';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { GetItemReviewsDto, ReplyReviewsDto } from '../dto/review.dto';
import {
  BooleanValidationPipe,
  ObjectValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createReviewValidator,
  replyReviewValidator,
  searchReviewValidator,
} from '../validator/review.validator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { AdsService } from '../../ads/service/ads.service';
import { CommentService } from '../service/comment.service';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { TalentService } from '../../talent/service/talent.service';
import { Promotion } from '../../promotion/model/promotion.model';
import { PromotionTypeEnum } from '../../promotion/enum/promotion.enum';
// import { AccountPromotionService } from '../../promotion/service/account-promotion.service';

@Controller('review')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(
    private readonly reviewService: ReviewService,
    private readonly adsService: AdsService,
    private readonly talentService: TalentService,
    private readonly commentService: CommentService,
    private readonly configurationService: ConfigurationService, // private readonly accountPromotionService: AccountPromotionService,
  ) {}

  @Get('configuration')
  async reviewSetting(@TokenDecorator() { id }: TokenDataDto) {
    return this.reviewService.allowReviewConfiguration(id);
  }

  @Patch('configuration')
  async changeReviewSetting(
    @TokenDecorator() { id }: TokenDataDto,
    @Body('allowReview', new BooleanValidationPipe()) allowReview: boolean,
  ) {
    const reviewConfig = { allowReview: true };

    const [subscription, configuration] = await Promise.all([
      this.reviewService.lastSubscription(id),
      this.configurationService.findOrCreateConfiguration(id),
    ]);
    if (!subscription) return reviewConfig;

    const promotion = subscription.promotion as unknown as Promotion;

    this.logger.debug({ promotion });

    switch (promotion.name) {
      case PromotionTypeEnum.GOLD:
      case PromotionTypeEnum.PLATINUM:
        {
          configuration.allowReview = allowReview;
          reviewConfig.allowReview = allowReview;
          await configuration.save();
        }

        break;
    }

    return reviewConfig;
  }

  @Post()
  async createReview(
    @TokenDecorator() { id }: TokenDataDto,
    @Body(new ObjectValidationPipe(createReviewValidator)) review: Review,
  ) {
    let accountItem;

    switch (review.reference) {
      case ResourceEnum.Ads: {
        accountItem = await this.adsService.findByIdOrErrorOut(review.item);
        break;
      }

      case ResourceEnum.Talent: {
        accountItem = await this.talentService.findByIdOrErrorOut(review.item);
        break;
      }

      default:
        throw new NotFoundException('item not found');
    }

    if (accountItem.account.toString() === id) {
      throw new NotAcceptableException(
        `you are not allowed to review your ${review.reference}`,
      );
    }

    const { allowReview } = await this.reviewService.allowReviewConfiguration(
      accountItem.account.toString(),
    );

    if (!allowReview) {
      throw new NotAcceptableException(`account not allowing review this time`);
    }

    const comment = new this.commentService.model({
      account: id,
      comment: review.comment,
    });
    review.reviewer = id;
    review.comment = comment._id.toString();

    review.account = accountItem.account;
    const [newReview] = await Promise.all([
      this.reviewService.create(review),
      comment.save(),
    ]);
    return newReview;
  }

  @Post('reply')
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
      throw new NotAcceptableException(
        `you can only reply to review of your ${review.reference}`,
      );
    }

    const [newReview] = await Promise.all([review.save(), comment.save()]);

    return newReview.populate([{ path: 'comment reply' }, { path: 'item' }]);
  }

  @Get('rating-analysis')
  async reviewRatingAnalysis(
    @Query(new ObjectValidationPipe(searchReviewValidator))
    review: GetItemReviewsDto,
  ) {
    const filter: FilterQuery<Review> = {};

    if ('reviewer' in review)
      filter.reviewer = new Types.ObjectId(review.reviewer);
    if ('account' in review)
      filter.account = new Types.ObjectId(review.account);

    if ('rating' in review) filter.rating = review.rating;

    if ('item' in review) filter.item = new Types.ObjectId(review.item);
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $group: { _id: '$rating', numberOfRating: { $count: {} } } },
    ];

    return this.reviewService.aggregate(pipeline);
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

    if ('rating' in review) filter.rating = review.rating;

    if ('item' in review) filter.item = new Types.ObjectId(review.item);

    if ('id' in review) filter._id = new Types.ObjectId(review.id);

    if ('countOnly' in review) return this.reviewService.countDocuments(filter);

    return this.reviewService.paginatedResultAverage(
      { limit, page },
      filter,
      'rating',
      { createdAt: -1 },
      [
        { path: 'account reviewer', select: 'firstName lastName photo' },
        { path: 'comment reply' },
      ],
    );
  }
}
