import * as Joi from 'joi';
import { Types } from 'mongoose';
export const objectIdValidator = Joi.string()
  .trim()
  .custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    return helpers.message({
      '*': `${value} is not a valid objectId`,
    });
  });

export const customObjectIdValidator = Joi.custom((value, helpers) => {
  if (Types.ObjectId.isValid(value)) {
    return value;
  }
  return helpers.message({
    '*': `${value} is not a valid objectId`,
  });
});
