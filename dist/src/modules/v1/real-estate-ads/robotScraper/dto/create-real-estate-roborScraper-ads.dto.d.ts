declare class AdItemScraper {
    field_name: string;
    value: string;
}
declare class AdMediaScraper {
    id: number;
    file_name: string;
    file_type: string;
    sort_number: number;
    priority: string;
}
export declare class CreateRealEstateAdRobotScraperDto {
    client_id: number;
    tracking_code: string;
    seller_type: string;
    tag: string;
    owner_name: string;
    owner_phone: string;
    category: string;
    sub_category: string;
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
    province: number;
    city: number;
    area: string;
    items: AdItemScraper[];
    media: AdMediaScraper[];
}
export declare class DownloadFileUrl {
    url: string;
    dest: string;
}
export {};
