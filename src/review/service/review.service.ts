import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Review } from '../model/review.model';
import { Model } from 'mongoose';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    @InjectModel(Review.name) private readonly ReviewModel: Model<Review>,
  ) {
    super(ReviewModel);
  }
}
