import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Ads } from '../model/ads.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdsService extends BaseService<Ads> {
  private readonly logger = new Logger(AdsService.name);

  constructor(@InjectModel(Ads.name) AdsModel: Model<Ads>) {
    super(AdsModel);
  }
}
