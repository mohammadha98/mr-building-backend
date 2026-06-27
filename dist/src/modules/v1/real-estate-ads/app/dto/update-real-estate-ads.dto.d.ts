declare class AdItem {
    id: string;
    value: string;
}
export declare class UpdateRealEstateAdDto {
    client_id: number;
    id: number;
    seller_type: string;
    agent_valuation_request: boolean;
    category_id: string;
    sub_category_id: string;
    agent_id: number;
    advisor_id: number;
    display_contact: boolean;
    title: string;
    description: string;
    is_applicant: boolean;
    year_built: number;
    size: number;
    sale_price: number;
    deposit_price: number;
    rent_price: number;
    number_of_rooms: number;
    max_capicity: number;
    normal_days_price: number;
    weekend_price: number;
    special_days_price: number;
    cost_per_additional_person: number;
    extra_people: number;
    latitude: number;
    longitude: number;
    province_id: number;
    city_id: number;
    area: string;
    is_timed: boolean;
    expired_at: any;
    items: AdItem[];
}
export declare class UpdateExpiredAd {
    client_id: number;
    adId: number;
    expired_at: any;
}
export {};
