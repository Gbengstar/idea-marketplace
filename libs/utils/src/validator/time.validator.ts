import * as Joi from 'joi';
export const timeValidator = Joi.string()
  .trim()
  .regex(/^([0-9]{2})\:([0-9]{2})$/);
