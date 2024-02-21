import * as Joi from 'joi';
export const refreshTokenValidator = Joi.object({
  expiredToken: Joi.string().trim().required(),
  refreshToken: Joi.string().trim().required(),
});
