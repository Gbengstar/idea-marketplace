import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from '../model/sub-category.model';

@Injectable()
export class SubCategoryService extends BaseService<SubCategory> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly SubCategoryModel: Model<SubCategory>,
  ) {
    super(SubCategoryModel);
  }
}
