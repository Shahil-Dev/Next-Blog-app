type IOptions = {
  page?: number;
  limit?: number;
  skip?: number;
  SortBy?: string | undefined;
  SortOrder?: string | undefined;
};

type IOptionResult = {
  page: number;
  limit: number;
  skip: number;
  SortBy: string;
  SortOrder: string;
};
const PaginationAndSortingHelper = (option: IOptions): IOptionResult => {
  const page: number = Number(option.page) ?? 1;
  const limit: number = Number(option.limit) ?? 10;
  const skip = (page - 1) * limit;
  const SortBy: string = (option.SortBy as string) || "createdAt";
  const SortOrder: string = (option.SortOrder as string) || "desc";

  return {
    page,
    limit,
    skip,
    SortBy,
    SortOrder,
  };
};

export default PaginationAndSortingHelper;
