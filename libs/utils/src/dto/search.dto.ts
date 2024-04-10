import { PaginationDto } from '../pagination/dto/paginate.dto';

export type PaginateAtlasSearchDto = PaginationDto & { keyword: string };

export type KeywordPaginatedSearchDto = PaginationDto & { keyword: string };

export type LandingPagePaginatedSearchDto<T = unknown> = PaginationDto & {
  id: string;
} & T;
