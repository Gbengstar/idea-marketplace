import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { WishList } from '../model/wish-list.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WishListService extends BaseService<WishList> {
  constructor(
    @InjectModel(WishList.name) private readonly WishListModel: Model<WishList>,
  ) {
    super(WishListModel);
  }
}
