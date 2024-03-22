import * as Joi from 'joi';
import { Ads } from '../model/ads.model';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { DistinctFilterDto, SearchAdsDto } from '../dto/ads.dto';

export const createAdsValidator = Joi.object<Ads>({
  store: objectIdValidator.required(),
  category: objectIdValidator.required(),
  subCategory: objectIdValidator.required(),
  typeOfOwner: Joi.string().required(),
  brandName: Joi.string().required(),
  productOption: Joi.string().required(),
  condition: Joi.string().required(),
  glance: Joi.array().min(4).items(Joi.string().required()).required(),
  peculiarities: Joi.array().min(4).items(Joi.string().required()),
  price: Joi.number().required(),
  negotiable: Joi.boolean().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().min(5).items(Joi.string().required()),
});

export const distinctAdsPropValidator = Joi.object<DistinctFilterDto>({
  distinct: Joi.string()
    .required()
    .valid('typeOfOwner', 'brandName', 'productOption', 'condition'),
  store: objectIdValidator,
  category: objectIdValidator,
  subCategory: objectIdValidator,
  typeOfOwner: Joi.string(),
  brandName: Joi.string(),
  productOption: Joi.string(),
  condition: Joi.string(),
});

export const searchAdsValidator = Joi.object<SearchAdsDto>({
  keyword: Joi.string().trim(),
  account: objectIdValidator,
});
