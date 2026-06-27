export declare enum SelectedAdStatus {
    all = "all",
    search = "search",
    individual = "individual",
    real_estate_agent = "real_estate_agent"
}
export declare class GetRealEstateAdDto {
    client_id: number;
    status: string;
    category_id: string;
    sub_category_id: string;
    type: string;
    tag: string;
    sort: string;
    province_id: number;
    city_id: number;
    keyword: string;
    page: number;
    per_page: number;
}
