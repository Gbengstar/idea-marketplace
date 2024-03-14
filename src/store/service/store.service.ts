import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Store } from '../model/store.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';

@Injectable()
export class StoreService extends BaseService<Store> {
  private readonly logger = new Logger(StoreService.name);
  constructor(
    @InjectModel(Store.name) private readonly StoreModel: Model<Store>,
  ) {
    super(StoreModel);
  }

  updateStore(data: Partial<Store>) {
    const updateData: UpdateQuery<Store> = { $addToSet: {}, $push: {} };

    if (data.languages) {
      updateData.$addToSet.languages = data.languages;
      data.languages = undefined;
    }

    if (data.locations) {
      updateData.$push.locations = data.locations;
      data.locations = undefined;
    }

    return this.findOneAndUpdateOrErrorOut(
      { account: data.account },
      { ...updateData, ...data },
    );
  }
}
