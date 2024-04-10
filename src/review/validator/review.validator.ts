import { paginationValidator } from './../../../libs/utils/src/pagination/validator/paginate.validator';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { Review } from '../model/review.model';
import * as Joi from 'joi';
import { ReviewRatingEnum } from '../enum/review.enum';
import { GetItemReviewsDto, ReplyReviewsDto } from '../dto/review.dto';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

export const createReviewValidator = Joi.object<Review>({
  item: objectIdValidator.required(),
  comment: Joi.string().required(),
  rating: Joi.number()
    .valid(...Object.values(ReviewRatingEnum))
    .required(),

  reference: Joi.string()
    .required()
    .valid(...Object.values(ResourceEnum)),
});

export const replyReviewValidator = Joi.object<ReplyReviewsDto>({
  id: objectIdValidator.required(),
  comment: Joi.string().required(),
});

export const searchReviewValidator =
  paginationValidator.append<GetItemReviewsDto>({
    id: objectIdValidator,
    item: objectIdValidator,
    rating: Joi.number().valid(...Object.values(ReviewRatingEnum)),
    account: objectIdValidator,
    reviewer: objectIdValidator,
  });
