import { MarketplaceStorefrontSort } from "./list-storefront.dto";
export declare class SearchForRealEstateAgentDto {
    client_id: number;
    keyword: string;
    sort: MarketplaceStorefrontSort;
    province_id: number;
    page: number;
    per_page: number;
}
