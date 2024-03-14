import * as Joi from 'joi';
import { LocalLoginDto, LocalSignUpDto } from '../dto/auth.dto';

export const localSignUpValidator = Joi.object<LocalSignUpDto>({
  email: Joi.string().lowercase().email().required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  whatsapp: Joi.string().trim(),
});

export const localLoginValidator = Joi.object<LocalLoginDto>({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().trim(),
});

export const googleSignUpValidator = Joi.object({
  token: Joi.string().required(),
});
