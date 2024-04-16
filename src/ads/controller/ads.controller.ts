import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from '../service/ads.service';
import { Ads, AdsDocument } from '../model/ads.model';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createAdsValidator,
  distinctAdsPropValidator,
  searchAdsValidator,
} from '../validator/ads.validator';
import { DistinctFilterDto, SearchAdsDto } from '../dto/ads.dto';
import { WishListService } from '../../wish-list/service/wish-list.service';
import { FilterQuery } from 'mongoose';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { regexQuery } from '../../../libs/utils/src/general/function/general.function';

@Controller('ads')
export class AdsController {
  private readonly logger = new Logger(AdsController.name);

  constructor(
    private readonly adsService: AdsService,
    private readonly wishListService: WishListService,
  ) {}

  @Post()
  createAds(
    @Body(new ObjectValidationPipe(createAdsValidator)) ads: Ads,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    ads.account = id;
    return this.adsService.create(ads);
  }

  @Get()
  getAds(@TokenDecorator() { id }: TokenDataDto) {
    return this.adsService.find({ account: id });
  }

  @Get('landing-page')
  @ViewResource(ResourceEnum.Ads)
  @UseGuards(ViewEventGuard)
  async landingPageAds(
    @TokenDecorator() token: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { page, limit, ...query }: SearchAdsDto,
  ) {
    // const filter: FilterQuery<Ads> = {};
    // if ('id' in query) filter._id = query.id;
    // if ('condition' in query) filter.condition = query.condition;
    // if ('location' in query)
    //   filter['store.locations.address'] = regexQuery(query.location);
    // if ('negotiable' in query) filter.negotiable = query.negotiable;
    // if ('verifiedVendor' in query)
    //   filter.account.verified = query.verifiedVendor;

    const [ads, wishList] = await Promise.all([
      this.adsService.searchAds({ page, limit, ...query }),
      this.wishListService.wishListIds({ account: token?.id, ref: 'ads' }),
    ]);

    if (!(token && wishList[0])) return ads;

    for (const ad of ads.foundItems) {
      ad.wish = wishList.includes(ad._id.toString());
    }

    return ads;
  }

  @Get('search')
  async searchAds(
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { keyword, account, page, limit }: SearchAdsDto,
  ) {
    const path = ['title', 'description', 'brandName', 'store'];
    const key = keyword || ' ';

    const [ads, wishList] = await Promise.all([
      this.adsService.atlasSearch<AdsDocument>({ page, limit }, key, path),
      this.wishListService.wishListIds({ account, ref: 'ads' }),
    ]);

    if (!(account && wishList[0])) return ads;

    for (const ad of ads.foundItems) {
      ad.wish = wishList.includes(ad._id.toString());
    }

    return ads;
  }

  @Get('distinct-properties')
  distinct(
    @Query(new ObjectValidationPipe(distinctAdsPropValidator))
    { distinct, ...filter }: DistinctFilterDto,
  ) {
    return this.adsService.model.distinct(distinct, filter);
  }

  @Get('/:id')
  getAd(@Param('id') id: string) {
    return this.adsService.findOne({ _id: id });
  }
}
