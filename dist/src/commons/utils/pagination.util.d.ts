import { PaginationDto } from "../dto/pagination.dto";
export declare function PaginationSolver(paginationDto: PaginationDto): {
    page: number;
    per_page: number;
    skip: number;
};
export declare function PaginationGenerator(page: number, per_page: number, count: number): {
    page: number;
    per_page: number;
    total_page: number;
    next: boolean;
    back: boolean;
};
