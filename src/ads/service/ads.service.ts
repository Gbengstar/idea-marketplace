import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Ads, AdsDocument } from '../model/ads.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { SearchAdsDto } from '../dto/ads.dto';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';
import { Store } from '../../store/model/store.model';

@Injectable()
export class AdsService extends BaseService<Ads> {
  private readonly logger = new Logger(AdsService.name);

  constructor(@InjectModel(Ads.name) AdsModel: Model<Ads>) {
    super(AdsModel);
  }

  searchAds({ page, limit, ...query }: SearchAdsDto) {
    this.logger.log({ query });

    const filter: FilterQuery<Ads> = {};
    const storeFilter: FilterQuery<Store> = {};
    const storeMatchFilter: FilterQuery<Store> = {};
    if ('id' in query) filter._id = query.id;
    if ('condition' in query) filter.condition = query.condition;
    if ('location' in query) {
      storeFilter['locations.address'] = regexQuery(query.location);

      storeMatchFilter['store.locations'] = {
        $elemMatch: { address: regexQuery(query.location) },
      };
    }
    if ('negotiable' in query) filter.negotiable = query.negotiable;
    if ('verifiedVendor' in query)
      filter.account.verified = query.verifiedVendor;
    if ('price' in query) {
      filter.price = { $gte: query.price.min, $lte: query.price.max };
    }

    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'stores',
          foreignField: '_id',
          localField: 'store',
          as: 'store',
          pipeline: [{ $match: storeFilter }],
        },
      },
      {
        $addFields: {
          store: {
            $arrayElemAt: ['$store', 0],
          },
        },
      },
      { $match: storeMatchFilter },
    ];
    return this.aggregatePagination<AdsDocument>({ page, limit }, pipeline);
  }
}
