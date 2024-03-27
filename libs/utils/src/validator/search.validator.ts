import * as Joi from 'joi';
import { paginationValidator } from '../pagination/validator/paginate.validator';
import { KeywordPaginatedSearchDto } from '../dto/search.dto';

export const keywordSearchValidator =
  paginationValidator.append<KeywordPaginatedSearchDto>({
    keyword: Joi.string().required(),
  });
