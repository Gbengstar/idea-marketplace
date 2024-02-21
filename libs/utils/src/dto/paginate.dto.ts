export class PaginationResponseDto<T> {
  limit: number;
  nextPage: number;
  currentPage: number;
  totalNumberOfItems: number;
  foundItems: T[];
}
