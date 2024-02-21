import * as Joi from 'joi';

export const passwordValidator = Joi.string()
  .trim()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .error(new Error('please provide a strong password'));
