import { PaginationDto } from "src/commons/dto/pagination.dto";
import SortingTypes from "src/commons/contracts/SortingTypes";
declare class FilteredProductFields {
    from: number;
    to: number;
}
export declare class FilterProductsDto extends PaginationDto {
    categoryId: string;
    subCategoryId: string;
    brandId: string;
    price: FilteredProductFields;
    sort: SortingTypes;
}
export {};
