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
import { PopulateOptions, Types } from 'mongoose';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';
import { Ads } from '../../ads/model/ads.model';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

@Controller('wish-list')
export class WishListController {
  private readonly logger = new Logger(WishListController.name);

  constructor(private readonly wishListService: WishListService) {}

  @Post('ads')
  async addToWishList(
    @Body('ads', new StringValidationPipe(stringValidator.required()))
    ads: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    const wish = await this.wishListService.findOne({ account: id, wish: ads });

    if (wish) return wish;

    return this.wishListService.create({
      account: id,
      ref: ResourceEnum.Ads,
      wish: new Types.ObjectId(ads),
    });
  }

  @Get('ads')
  async getWishList(
    @TokenDecorator() { id }: TokenDataDto,
    @Query(new ObjectValidationPipe(paginationValidator))
    paginate: PaginationDto,
  ) {
    const filter = { account: new Types.ObjectId(id), ref: 'ads' };

    const populate: PopulateOptions[] = [
      {
        path: 'wish',
        model: 'Ads',
        transform: (doc: Ads) => {
          doc.wish = true;
          return doc;
        },
        populate: { path: 'store' },
      },
    ];

    return this.wishListService.paginatedResult(
      paginate,
      filter,
      { createdAt: -1 },
      populate,
    );
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
