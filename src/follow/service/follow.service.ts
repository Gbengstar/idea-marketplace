import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Follow } from '../model/follow.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FollowService extends BaseService<Follow> {
  constructor(
    @InjectModel(Follow.name) private readonly FollowModel: Model<Follow>,
  ) {
    super(FollowModel);
  }

  async followingStoreIds(account: string) {
    const follows = await this.FollowModel.find({ account });
    return follows.map((follow) => follow.store.toString());
  }
}
