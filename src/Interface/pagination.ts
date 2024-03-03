import { SortOrder } from "mongoose";

export type IPaginationOPtions = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
};
