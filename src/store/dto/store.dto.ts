import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { BusinessHoursEnum } from '../enum/store.enum';

export type BusinessHours = { from: BusinessHoursEnum; to: BusinessHoursEnum };

export type SearchStoreDto = PaginationDto & { id: string };
