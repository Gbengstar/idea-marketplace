import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Ads } from '../model/ads.model';

export type DistinctFilterDto = { distinct: string } & Ads;

export type SearchAdsDto = PaginationDto & {
  price: { min: number; max: number };
  keyword: string;
  account: string;
  location: string;
  verified: boolean;
  negotiable: boolean;
  condition: string;
  category: string;
  subCategory: string;
  productType: string;
  sortBy: string;
  orderBy: 1 | -1;
};

export type AvailableAdsDto = { ids: string[]; available: boolean };
