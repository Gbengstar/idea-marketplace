import * as Joi from 'joi';
import { Job } from '../model/job.model';
import { JobLocationTypeEnum, JobTypeEnum } from '../enum/job.enum';
import { StatusEnum } from '../../../libs/utils/src/enum/status.enum';

export const createJobValidator = Joi.object<Job>({
  description: Joi.string().required(),
  locationType: Joi.string()
    .valid(...Object.values(JobLocationTypeEnum))
    .required(),
  jobTitle: Joi.string().required(),
  salaryRange: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
  }).required(),
  jobType: Joi.string()
    .valid(...Object.values(JobTypeEnum))
    .required(),
  nationality: Joi.string(),
  applicationUrl: Joi.string().uri(),
  expirationDate: Joi.date().iso().required(),
  status: Joi.string().default(StatusEnum.Active).valid(StatusEnum.Active),
});

export const updateJobValidator = Joi.object<Job>({
  description: Joi.string(),
  locationType: Joi.string().valid(...Object.values(JobLocationTypeEnum)),
  jobTitle: Joi.string(),
  salaryRange: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
  }),
  jobType: Joi.string().valid(...Object.values(JobTypeEnum)),
  nationality: Joi.string(),
  applicationUrl: Joi.string().uri(),
  expirationDate: Joi.date().iso(),
  status: Joi.string().default(StatusEnum.Active).valid(StatusEnum.Active),
});
