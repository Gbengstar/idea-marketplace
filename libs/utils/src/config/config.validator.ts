import { envValidator } from '@app/utils/env/validator/env.validator';
import * as Joi from 'joi';
import { EnvConfigEnum } from './env.enum';

export const envConfigValidator = envValidator.append({
  [EnvConfigEnum.PORT]: Joi.number().required(),
  [EnvConfigEnum.SESSION_SECRET]: Joi.string().required(),
  [EnvConfigEnum.TOKEN_SECRET]: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  TYPE: Joi.string().required(),
  PROJECT_ID: Joi.string().required(),
  PRIVATE_KEY_ID: Joi.string().required(),
  PRIVATE_KEY: Joi.string().required(),
  CLIENT_EMAIL: Joi.string().required(),
  CLIENT_ID: Joi.string().required(),
  AUTH_URI: Joi.string().required(),
  TOKEN_URI: Joi.string().required(),
  AUTH_CERT_URL: Joi.string().required(),
  CLIENT_CERT_URL: Joi.string().required(),
  UNIVERSAL_DOMAIN: Joi.string().required(),
});
