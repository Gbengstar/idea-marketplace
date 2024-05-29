import * as Joi from 'joi';
import { Job } from '../model/job.model';
import { JobLocationTypeEnum, JobTypeEnum } from '../enum/job.enum';
import { landingPageSearchValidator } from '../../../libs/utils/src/validator/search.validator';
import { LandingPagePaginatedSearchDto } from '../../../libs/utils/src/dto/search.dto';
import { paginationValidator } from '../../../libs/utils/src/pagination/validator/paginate.validator';
import { JobSearchDto } from '../dto/job.dto';
import { ResourceStatusEnum } from '../../../libs/utils/src/dto/resource.dto';

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
  status: Joi.string()
    .default(ResourceStatusEnum.Published)
    .valid(ResourceStatusEnum.Published),
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
});

export const jobLandingPageSearchValidator = landingPageSearchValidator.append<
  LandingPagePaginatedSearchDto<Job>
>({
  jobTitle: Joi.string(),
  locationType: Joi.string().valid(...Object.values(JobLocationTypeEnum)),
  jobType: Joi.string().valid(...Object.values(JobTypeEnum)),
});

export const jobSearchValidator = paginationValidator.append<JobSearchDto>({
  keyword: Joi.string(),
});
