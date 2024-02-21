import * as Joi from 'joi';
export const emailValidator = Joi.string().trim().email().lowercase();

export const stringValidator = Joi.string().trim();

export const numberValidator = Joi.number();

export const arrayValidator = Joi.array();
