import { Injectable } from '@nestjs/common';
import { PromotionTypeEnum } from '../enum/promotion.enum';
import { PromotionConfigurationSettings } from '../dto/promotion.dto';

@Injectable()
export class PromotionConfigurationService {
  private readonly promotionConfiguration: Map<
    PromotionTypeEnum,
    PromotionConfigurationSettings
  >;
  constructor() {
    this.promotionConfiguration = new Map();
    this.promotionConfiguration.set(PromotionTypeEnum.PLATINUM, {
      renewTimeMilliseconds: 60 * 1000, //3 * 60 * 60 * 1000,
    });
    this.promotionConfiguration.set(PromotionTypeEnum.GOLD, {
      renewTimeMilliseconds: 4 * 60 * 60 * 1000,
    });
    this.promotionConfiguration.set(PromotionTypeEnum.SILVER, {
      renewTimeMilliseconds: 6 * 60 * 60 * 1000,
    });
    this.promotionConfiguration.set(PromotionTypeEnum.QUICKIE, {
      renewTimeMilliseconds: 6 * 60 * 60 * 1000,
    });
  }

  get(key: PromotionTypeEnum) {
    return this.promotionConfiguration.get(key);
  }
}
