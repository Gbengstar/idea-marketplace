import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { AdsService } from '../service/ads.service';
import { Ads } from '../model/ads.model';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createAdsValidator,
  distinctAdsPropValidator,
} from '../validator/ads.validator';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { DistinctFilterDto } from '../dto/ads.dto';

@Controller('ads')
export class AdsController {
  private readonly logger = new Logger(AdsController.name);

  constructor(private readonly adsService: AdsService) {}

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

  @Get('search')
  searchAds(
    @Query('key', new StringValidationPipe(stringValidator)) key: string,
  ) {
    this.logger.log({ key });
    const path = ['title', 'description', 'brandName', 'store'];
    return this.adsService.atlasSearch(key, path);
  }

  @Get()
  autocomplete(@Body() ads: Ads) {
    return this.adsService.create(ads);
  }

  @Get('distinct-properties')
  distinct(
    @Query(new ObjectValidationPipe(distinctAdsPropValidator))
    { distinct, ...filter }: DistinctFilterDto,
  ) {
    return this.adsService.model.distinct(distinct, filter);
  }
}
