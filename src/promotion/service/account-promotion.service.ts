import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { AccountPromotion } from '../model/account-promotion.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountPromotionService extends BaseService<AccountPromotion> {
  constructor(
    @InjectModel(AccountPromotion.name)
    private readonly AccountPromotionModel: Model<AccountPromotion>,
  ) {
    super(AccountPromotionModel);
  }
}
