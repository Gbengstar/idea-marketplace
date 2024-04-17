import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Ads, AdsDocument } from '../model/ads.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { SearchAdsDto } from '../dto/ads.dto';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';

@Injectable()
export class AdsService extends BaseService<Ads> {
  private readonly logger = new Logger(AdsService.name);

  constructor(@InjectModel(Ads.name) AdsModel: Model<Ads>) {
    super(AdsModel);
  }

  searchAds({ page, limit, ...query }: SearchAdsDto) {
    const filter: FilterQuery<Ads> = {};
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'stores',
          foreignField: '_id',
          localField: 'store',
          as: 'store',
        },
      },
      {
        $addFields: {
          store: {
            $arrayElemAt: ['$store', 0],
          },
        },
      },
    ];

    if ('id' in query) {
      filter._id = new Types.ObjectId(query.id);
    }

    if ('negotiable' in query) {
      filter.negotiable = query.negotiable;
    }

    if ('condition' in query) filter.condition = query.condition;

    if ('price' in query) {
      filter.price = { $gte: query.price.min, $lte: query.price.max };
    }

    if ('location' in query) {
      pipeline.push({
        $match: {
          'store.locations': {
            $elemMatch: { address: regexQuery(query.location) },
          },
        },
      });
    }

    if ('verified' in query) {
      pipeline.push(
        {
          $lookup: {
            from: 'accounts',
            foreignField: '_id',
            localField: 'account',
            as: 'accountData',
            pipeline: [{ $match: { verified: query.verified } }],
          },
        },
        {
          $addFields: {
            accountData: {
              $arrayElemAt: ['$accountData', 0],
            },
          },
        },
        { $match: { 'accountData.verified': query.verified } },
        { $project: { accountData: 0 } },
      );
    }

    return this.aggregatePagination<AdsDocument>({ page, limit }, pipeline);
  }
}
