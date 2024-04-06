import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { WishListService } from '../service/wish-list.service';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { PipelineStage, PopulateOptions, Types } from 'mongoose';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post('ads')
  async addToWishList(
    @Body('ads', new StringValidationPipe(stringValidator.required()))
    ads: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    return this.wishListService.create({
      account: id,
      ref: 'ads',
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
      { path: 'wish', model: 'Ads', populate: { path: 'store' } },
    ];

    return this.wishListService.paginatedResult(paginate, filter, {}, populate);

    // const pipeline: PipelineStage[] = [
    //   { $match: { account: new Types.ObjectId(id), ref: 'ads' } },
    //   {
    //     $lookup: {
    //       from: 'ads',
    //       foreignField: '_id',
    //       as: 'ads',
    //       localField: 'wish',
    //       pipeline: [
    //         {
    //           $lookup: {
    //             from: 'stores',
    //             foreignField: '_id',
    //             as: 'store',
    //             localField: 'store',
    //           },
    //         },
    //       ],
    //     },
    //   },
    // ];
    // return this.wishListService.aggregatePagination(paginate, pipeline);
  }

  @Delete('ads')
  async deleteWishList(
    @Query('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.wishListService.model.deleteOne({ account, _id: id });
  }
}
