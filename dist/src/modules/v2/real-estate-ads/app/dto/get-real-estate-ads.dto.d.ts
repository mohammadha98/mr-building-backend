export declare enum SelectedAdStatus {
    all = "all",
    search = "search",
    me = "me",
    individual = "individual",
    real_estate_agent = "real_estate_agent",
    advisor = "advisor",
    general_search = "general_search"
}
export declare class GetRealEstateAdDto {
    client_id: number;
    category_id: string;
    sub_category_id: string;
    type: string;
    tag: string;
    status: string;
    sort: string;
    agent_id: number;
    advisor_id: number;
    province_id: number;
    city_id: number;
    keyword: string;
    page: number;
    per_page: number;
}
