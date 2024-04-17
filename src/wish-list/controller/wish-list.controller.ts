import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { WishListService } from '../service/wish-list.service';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { FilterQuery, Types } from 'mongoose';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';
import { Ads } from '../../ads/model/ads.model';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { searchAdsValidator } from '../../ads/validator/ads.validator';
import { AdsService } from '../../ads/service/ads.service';
import { SearchAdsDto } from '../../ads/dto/ads.dto';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';

@Controller('wish-list')
export class WishListController {
  private readonly logger = new Logger(WishListController.name);

  constructor(
    private readonly wishListService: WishListService,
    private readonly adsService: AdsService,
  ) {}

  @Post('ads')
  async addToWishList(
    @Body('ads', new StringValidationPipe(stringValidator.required()))
    ads: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    const wish = await this.wishListService.findOne({
      account: id,
      wish: new Types.ObjectId(ads),
    });

    if (wish) return wish;

    return this.wishListService.create({
      account: id,
      reference: ResourceEnum.Ads,
      wish: new Types.ObjectId(ads),
    });
  }

  @Get('ads')
  async getWishList(
    @TokenDecorator() { id }: TokenDataDto,
    @Query(new ObjectValidationPipe(paginationValidator))
    paginate: PaginationDto,
  ) {
    const wishIds = await this.wishListService.wishListIds({ account: id });

    return this.adsService
      .paginatedResult(
        paginate,
        { _id: { $in: wishIds } },
        {
          createdAt: -1,
        },
      )
      .then((ads) => {
        ads.foundItems = ads.foundItems.map((ad: Ads) => {
          ad.wish = true;
          return ad;
        });

        return ads;
      });
  }

  @Get('ads-search')
  async searchWishList(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { keyword, limit, page }: SearchAdsDto,
  ) {
    const wishIds = await this.wishListService.wishListIds({ account });
    const query = regexQuery(keyword);

    const filter: FilterQuery<Ads> = {
      _id: { $in: wishIds },
      $or: [
        { location: query },
        { description: query },
        { title: query },
        { condition: query },
        { brandName: query },
      ],
    };

    return this.adsService
      .paginatedResult({ limit, page }, filter, {
        createdAt: -1,
      })
      .then((ads) => {
        ads.foundItems = ads.foundItems.map((ad: Ads) => {
          ad.wish = true;
          return ad;
        });

        return ads;
      });
  }

  @Delete('ads')
  async deleteWishList(
    @Query('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.wishListService.model.deleteOne({ account, wish: id });
  }
}
