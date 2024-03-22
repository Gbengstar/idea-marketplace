import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Promotion } from '../model/promotion.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PromotionService extends BaseService<Promotion> {
  constructor(@InjectModel(Promotion.name) PromotionModel: Model<Promotion>) {
    super(PromotionModel);
  }
}
