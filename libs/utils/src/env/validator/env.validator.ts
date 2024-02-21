import * as Joi from 'joi';
import { EnvConfigEnum } from '@app/utils/config/env.enum';
export const envValidator = Joi.object().keys({
  [EnvConfigEnum.NODE_ENV]: Joi.string().trim().required(),
});
