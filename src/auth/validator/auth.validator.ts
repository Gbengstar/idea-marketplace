import * as Joi from 'joi';
import { LocalLoginDto } from '../dto/auth.dto';

export const localSignUpValidator = Joi.object<LocalLoginDto>({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string(),
});
