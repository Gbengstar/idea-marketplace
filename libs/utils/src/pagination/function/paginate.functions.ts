import { FilterQuery, Model, SortOrder } from 'mongoose';
import { PaginationDto } from '../dto/paginate.dto';

export const paginatedResult = async <M>(
  paginationData: PaginationDto,
  query: FilterQuery<M>,
  model: Model<M>,
  sort?: string | { [key: string]: SortOrder },
  population?: string[],
) => {
  const { limit, page } = paginationData;
  const count = await model.countDocuments(query);
  // const count = 10;
  const foundItems = await model
    .find(query)
    .skip((page - 1) * limit)
    .sort(sort)
    .limit(limit)
    .populate(population);

  const totalPages = Math.ceil(count / limit);
  const nextPage = page + 1 > totalPages ? null : page + 1;

  return {
    count,
    limit,
    totalPages,
    nextPage,
    currentPage: page,
    foundItems,
  };
};
