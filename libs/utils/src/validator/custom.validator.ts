import * as Joi from 'joi';
import { objectIdValidator } from './objectId.validator';
import { IDDto, IDsDto } from '../dto/id.dto';
export const emailValidator = Joi.string().trim().email().lowercase();

export const stringValidator = Joi.string().trim();

export const numberValidator = Joi.number();

export const arrayValidator = Joi.array();

export const idsValidator = Joi.object<IDsDto>({
  ids: Joi.array().items(objectIdValidator.required()),
});

export const idValidator = Joi.object<IDDto>({
  id: objectIdValidator.required(),
});
