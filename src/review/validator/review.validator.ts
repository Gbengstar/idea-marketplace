import { paginationValidator } from './../../../libs/utils/src/pagination/validator/paginate.validator';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { Review } from '../model/review.model';
import * as Joi from 'joi';
import { ReviewRatingEnum } from '../enum/review.enum';

export const createReviewValidator = Joi.object<Review>({
  item: objectIdValidator.required(),
  comment: Joi.array().items(Joi.string()).required().max(1),
  rating: Joi.number()
    .valid(...Object.values(ReviewRatingEnum))
    .required(),
});

export const searchReviewValidator = paginationValidator.append<Review>({
  item: objectIdValidator,
  comment: Joi.array().items(Joi.string()),
});
