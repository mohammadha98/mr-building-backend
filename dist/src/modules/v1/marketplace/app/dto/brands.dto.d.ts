import { PaginationDto } from "src/commons/dto/pagination.dto";
export declare class GetBrands extends PaginationDto {
    type: string;
    keyword: string;
    sort: string;
}
