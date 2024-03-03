import { SortOrder } from "mongoose";

export type IPaginationOPtions = {
  page: number;
  limit: number;
  sortBy: string; // "createdAt" | "updatedAt"
  sortOrder: SortOrder; // "asc" | "desc"
};
