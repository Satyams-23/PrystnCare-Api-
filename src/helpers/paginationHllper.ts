import { SortOrder } from 'mongoose';

type IOptions = {
  page?: number; // means which page you want to show
  limit?: number; // means how many records you want to show on one page
  sortBy?: string; // means sort by name or date or any other field
  sortOrder?: SortOrder; // means ascending or descending
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const caculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit; // means how many records you want to skip from the first page to show the second page records

  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  caculatePagination,
};
