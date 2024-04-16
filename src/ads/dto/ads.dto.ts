import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Ads } from '../model/ads.model';

export type DistinctFilterDto = { distinct: string } & Ads;

export type SearchAdsDto = PaginationDto & {
  id: string;
  price: { min: number; max: number };
  keyword: string;
  account: string;
  location: string;
  verifiedVendor: boolean;
  negotiable: boolean;
  condition: string;
  category: string;
  subCategory: string;
};
