import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Review } from '../model/review.model';

export type GetItemReviewsDto = Review & PaginationDto;
