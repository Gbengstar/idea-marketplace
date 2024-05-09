import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Review } from '../model/review.model';
import { Model } from 'mongoose';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { AccountPromotion } from '../../promotion/model/account-promotion.model';
import { ConfigurationService } from '../../configuration/service/configuration.service';
import { Promotion } from '../../promotion/model/promotion.model';
import { PromotionTypeEnum } from '../../promotion/enum/promotion.enum';

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    @InjectModel(Review.name) private readonly ReviewModel: Model<Review>,
    @InjectModel(AccountPromotion.name)
    private readonly AccountPromotionModel: Model<AccountPromotion>,
    private readonly configurationService: ConfigurationService,
  ) {
    super(ReviewModel);
  }

  async lastSubscription(account: string) {
    return this.AccountPromotionModel.findOne({
      account,
    })
      .populate([{ path: 'promotion', select: 'amount name' }])
      .sort({ createdAt: -1 });
  }

  async allowReviewConfiguration(account: string) {
    const reviewConfig = { allowReview: true };

    const [subscription, configuration] = await Promise.all([
      this.lastSubscription(account),
      this.configurationService.findOrCreateConfiguration(account),
    ]);
    if (!subscription) return reviewConfig;

    const promotion = subscription.promotion as unknown as Promotion;

    switch (promotion.name) {
      case PromotionTypeEnum.GOLD:
      case PromotionTypeEnum.PLATINUM:
        {
          reviewConfig.allowReview = configuration.allowReview;
        }

        break;
    }

    return reviewConfig;
  }
}
