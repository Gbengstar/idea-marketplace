import * as Joi from 'joi';

export const paginationValidator = Joi.object({
  limit: Joi.number().default(() => 50),
  page: Joi.number().default(() => 1),
});
