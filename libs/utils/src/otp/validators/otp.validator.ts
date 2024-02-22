import * as Joi from 'joi';
export const otpValidator = Joi.object({
  code: Joi.string().trim().required(),
  id: Joi.string().trim().required(),
});

export const verifyOtpByEmailValidator = Joi.object({
  code: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
});
