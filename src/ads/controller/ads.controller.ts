import { SharpService } from './../../../libs/utils/src/file-upload/service/sharp.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdsService } from '../service/ads.service';
import { Ads, AdsDocument } from '../model/ads.model';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import {
  createAdsValidator,
  distinctAdsPropValidator,
  searchAdsValidator,
} from '../validator/ads.validator';
import { DistinctFilterDto, SearchAdsDto } from '../dto/ads.dto';
import { WishListService } from '../../wish-list/service/wish-list.service';
import { ViewResource } from '../../view/decorator/view.decorator';
import { ViewEventGuard } from '../../view/guard/guard.view';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { FollowService } from '../../follow/service/follow.service';
import { StoreDocument } from '../../store/model/store.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StoreService } from '../../store/service/store.service';
import { FileUploadService } from '../../../libs/utils/src/file-upload/service/file-upload.service';

@Controller('ads')
export class AdsController {
  private readonly logger = new Logger(AdsController.name);

  constructor(
    private readonly adsService: AdsService,
    private readonly wishListService: WishListService,
    private readonly followService: FollowService,
    private readonly sharpService: SharpService,
    private readonly storeService: StoreService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  createAds(
    @Body(new ObjectValidationPipe(createAdsValidator)) ads: Ads,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    ads.account = id;
    return this.adsService.create(ads);
  }

  @Post('/water-marked-images')
  @UseInterceptors(
    FilesInterceptor('file[]', 6, {
      limits: { fieldSize: 6, fileSize: 5000000 },
    }),
  )
  async uploadAdsImage(
    @TokenDecorator() { id }: TokenDataDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const storeName = await this.storeService.getStoreNameByAccount(id);

    files = await this.sharpService.processAdsImage(
      files,
      storeName.toUpperCase(),
    );

    return this.fileUploadService.fileUploadMany(files, id);
  }

  @Get()
  getAds(@TokenDecorator() { id }: TokenDataDto) {
    return this.adsService.find({ account: id });
  }

  @Get('landing-page')
  async landingPageAds(
    @TokenDecorator() token: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { page, limit, ...query }: SearchAdsDto,
  ) {
    const [ads, wishList] = await Promise.all([
      this.adsService.searchAds({ page, limit, ...query }),
      this.wishListService.wishListIds({
        account: token?.id,
        reference: ResourceEnum.Ads,
      }),
    ]);

    if (!(token || wishList[0])) return ads;

    for (const ad of ads.foundItems) {
      ad.wish = wishList.includes(ad._id.toString());
    }

    return ads;
  }

  @Get('landing-page/:id')
  @ViewResource(ResourceEnum.Ads)
  @UseGuards(ViewEventGuard)
  async oneAds(
    @TokenDecorator() token: TokenDataDto,
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
  ) {
    const [ads, wishList, follow] = await Promise.all([
      this.adsService.findByIdOrErrorOut(id, [{ path: 'store' }]),
      this.wishListService.wishListIds({
        account: token?.id,
        reference: ResourceEnum.Ads,
      }),
      this.followService.followingStoreIds(token?.id),
    ]);

    if (wishList[0]) ads.wish = wishList.includes(ads._id.toString());
    if (follow[0]) {
      const store = ads.store as unknown as StoreDocument;
      store.follow = follow.includes(store._id.toString());
    }

    return ads;
  }

  @Get('search')
  async searchAds(
    @TokenDecorator() token: TokenDataDto,
    @Query(new ObjectValidationPipe(searchAdsValidator))
    { keyword, account, page, limit }: SearchAdsDto,
  ) {
    const path = ['title', 'description', 'brandName', 'store'];
    const key = keyword || ' ';

    const [ads, wishList] = await Promise.all([
      this.adsService.atlasSearch<AdsDocument>({ page, limit }, key, path),
      this.wishListService.wishListIds({
        account: token?.id,
        reference: ResourceEnum.Ads,
      }),
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
