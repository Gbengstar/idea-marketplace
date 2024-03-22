import * as Joi from 'joi';
import { Promotion } from '../model/promotion.model';
import { PromotionTypeEnum } from '../enum/promotion.enum';

export const createPromotionValidator = Joi.object<Promotion>({
  name: Joi.string()
    .valid(...Object.values(PromotionTypeEnum))
    .required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.array().items(Joi.string().required()).required(),
  position: Joi.number().required(),
  popular: Joi.boolean().default(false),
  hidden: Joi.boolean().default(false),
});
