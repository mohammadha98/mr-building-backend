import { PaginationDto } from "../dto/pagination.dto";

export function PaginationSolver(paginationDto: PaginationDto) {
  let { per_page = 12, page = 0 } = paginationDto;

  if (!page || page <= 0) page = 0;
  else page = page - 1;

  if (!per_page || per_page < 1) per_page = 12;
  const skip = per_page * page;

  return {
    page: +page,
    per_page: +per_page,
    skip: +skip,
  };
}

export function PaginationGenerator(
  page: number,
  per_page: number,
  count: number
) {
  const total_page = Math.ceil(count / per_page);
  return {
    page: +page,
    per_page: +per_page,
    total_page,
    next: page < total_page,
    back: page > 1,
  };
}
