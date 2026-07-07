export declare enum MarketplaceStorefrontSort {
    newest = "newest",
    oldest = "oldest",
    best_selling = "best_selling",
    most_chosen = "most_chosen"
}
export declare class ListStorefrontDto {
    user_id: number;
    page: string;
    per_page: string;
    keyword: string;
    category_id: string;
    province_id: string;
    city_id: string;
    sort: MarketplaceStorefrontSort;
}
