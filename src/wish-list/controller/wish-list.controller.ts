import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { WishListService } from '../service/wish-list.service';
import { StringValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { Types } from 'mongoose';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post()
  async addToWishList(
    @Body('ads', new StringValidationPipe(stringValidator.required()))
    ads: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    const wishList = await this.wishListService.findOneOrCreate(
      { account: id },
      { account: id },
    );
    const list = wishList.wishList.map((wishList) => wishList.toString());
    wishList.wishList = [
      ...new Set([ads, ...list]),
    ] as unknown as Types.ObjectId[];
    return wishList.save();
  }

  @Get()
  async getWishList(@TokenDecorator() { id }: TokenDataDto) {
    const wishList = await this.wishListService.findOneOrCreate(
      { account: id },
      { account: id },
    );

    return wishList.populate([
      { path: 'wishList', populate: { path: 'store' } },
    ]);
  }

  @Patch()
  async removeFromWishList(
    @Body('ads', new StringValidationPipe(stringValidator.required()))
    ads: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    const wishList = await this.wishListService.findOneOrCreate(
      { account: id },
      { account: id },
    );
    wishList.wishList = wishList.wishList.filter(
      (wishList) => wishList.toString() !== ads,
    );

    return wishList.save();
  }
}
