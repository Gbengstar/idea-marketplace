import * as Joi from 'joi';
import { Account } from '../model/account.model';

export const updateAccountDetails = Joi.object<Account>({
  photo: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  whatsapp: Joi.string(),
});
