import * as Joi from 'joi';
import { LocalSignUpDto } from '../dto/auth.dto';

export const localSignUpValidator = Joi.object<LocalSignUpDto>({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().required().min(3),
});
