import * as Joi from 'joi';
import { RevealContactDto } from '../dto/reveal.dto';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

export const getRevealLogValidator = Joi.object<RevealContactDto>({
  account: objectIdValidator.required(),
  resource: Joi.string()
    .required()
    .valid(...Object.values(ResourceEnum)),
});
