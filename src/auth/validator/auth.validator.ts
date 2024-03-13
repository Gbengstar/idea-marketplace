import * as Joi from 'joi';
import { LocalLoginDto } from '../dto/auth.dto';

export const localSignUpValidator = Joi.object<LocalLoginDto>({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string(),
});

export const googleSignUpValidator = Joi.object({
  token: Joi.string().required(),
});
