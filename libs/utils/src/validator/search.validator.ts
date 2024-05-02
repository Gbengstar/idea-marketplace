import * as Joi from 'joi';
import { paginationValidator } from '../pagination/validator/paginate.validator';
import {
  KeywordPaginatedSearchDto,
  LandingPagePaginatedSearchDto,
} from '../dto/search.dto';
import { objectIdValidator } from './objectId.validator';

export const keywordSearchValidator =
  paginationValidator.append<KeywordPaginatedSearchDto>({
    keyword: Joi.string().required(),
  });

export const landingPageSearchValidator =
  paginationValidator.append<LandingPagePaginatedSearchDto>({
    id: objectIdValidator,
  });
