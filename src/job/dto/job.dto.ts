import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';

export type JobSalaryRange = { max: number; min: number };

export type JobSearchDto = PaginationDto & { keyword: string };
