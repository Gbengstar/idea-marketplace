import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { WishList } from '../model/wish-list.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

@Injectable()
export class WishListService extends BaseService<WishList> {
  constructor(
    @InjectModel(WishList.name) private readonly WishListModel: Model<WishList>,
  ) {
    super(WishListModel);
  }

  async wishListIds(filter: { account: string; reference?: ResourceEnum }) {
    const wishList = await this.find(filter);
    if (!wishList[0]) return [];

    return wishList.map((wish) => wish.wish.toString());
  }
}
