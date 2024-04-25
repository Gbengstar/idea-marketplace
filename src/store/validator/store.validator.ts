import * as Joi from 'joi';
import { Store } from '../model/store.model';
import { Location } from '../schema/location.schema';
import { BusinessHours } from '../dto/store.dto';
import { BusinessHoursEnum } from '../enum/store.enum';

export const createStoreValidator = Joi.object<Store>({
  businessName: Joi.string().required(),
  photo: Joi.string(),
  description: Joi.string(),
  website: Joi.string(),
  languages: Joi.array().items(Joi.string()),
});

export const updateStoreValidator = Joi.object<Store>({
  businessName: Joi.string(),
  photo: Joi.string(),
  description: Joi.string(),
  website: Joi.string(),
  languages: Joi.array().items(Joi.string()),
});

export const addStoreLocationValidator = Joi.object<Location>({
  storeName: Joi.string().required(),
  region: Joi.string(),
  address: Joi.string(),
  workingDays: Joi.string(),
  businessHours: Joi.object<BusinessHours>({
    from: Joi.string()
      .valid(...Object.values(BusinessHoursEnum))
      .required(),
    to: Joi.string()
      .valid(...Object.values(BusinessHoursEnum))
      .required(),
  }),
});
