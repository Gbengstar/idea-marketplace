import * as Joi from 'joi';
import { Talent } from '../model/talent.model';
import { Education } from '../schema/talent-education.schema';
import { WorkExperience } from '../schema/talent-work-experience.schema';
import { Certification } from '../schema/talent-certification.schema';
import { landingPageSearchValidator } from '../../../libs/utils/src/validator/search.validator';
import { LandingPagePaginatedSearchDto } from '../../../libs/utils/src/dto/search.dto';

export const createTalentValidator = Joi.object<Talent>({
  photo: Joi.string().uri().required(),
  name: Joi.string().required(),
  portfolioUrl: Joi.string().uri().required(),
  cv: Joi.string().uri().required(),
  description: Joi.string().required(),
  skills: Joi.array().items(Joi.string()),
  mainSkill: Joi.string().required(),
  location: Joi.string().required(),
  yearsOfExperience: Joi.string().required(),
  education: Joi.array().items(
    Joi.object<Education>({
      name: Joi.string().required(),
      course: Joi.string().required(),
      degreeOrCertificate: Joi.string().required(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
      country: Joi.string(),
      state: Joi.string(),
    }),
  ),
  workExperience: Joi.array().items(
    Joi.object<WorkExperience>({
      company: Joi.string().required(),
      position: Joi.string().required(),
      locationType: Joi.string().valid().required(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
      country: Joi.string(),
      state: Joi.string(),
      description: Joi.string(),
    }),
  ),
  certification: Joi.array().items(
    Joi.object<Certification>({
      name: Joi.string().required(),
      provider: Joi.string().required(),
      issuedDate: Joi.date().iso(),
      certificateIdOrUrl: Joi.string().required(),
      description: Joi.string(),
    }),
  ),
  publishedDate: Joi.date().default(new Date()),
});

export const talentLandingPageSearchValidator =
  landingPageSearchValidator.append<LandingPagePaginatedSearchDto<Talent>>({
    location: Joi.string().trim(),
    name: Joi.string().trim(),
  });
