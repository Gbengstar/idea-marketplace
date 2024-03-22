import { Ads } from '../model/ads.model';

export type DistinctFilterDto = { distinct: string } & Ads;

export type SearchAdsDto = { keyword: string; account: string };
