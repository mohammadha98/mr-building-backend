import { PaginationDto } from "src/commons/dto/pagination.dto";
import SortingTypes from "src/commons/contracts/SortingTypes";
import { GetProductTypes } from "../../../marketplace-storefront/app/dto/get-product.dto";
export declare enum GetProductMarketplaceTypes {
    all = "all",
    category = "category",
    sub_category = "sub_category",
    brand = "brand"
}
export declare class GetProductsInMarketplaceDto extends PaginationDto {
    type: GetProductMarketplaceTypes;
    action: GetProductTypes;
    keyword: string;
    province_id: string;
    city_id: string;
    sort: SortingTypes;
    item_id: string;
}
