declare class FilteredFields {
    from: number;
    to: number;
}
declare class Item {
    id: number;
    value: string;
}
export declare class FilteredDto {
    client_id: number;
    category_id: string;
    sub_category_id: string;
    type: string;
    tag: string;
    sort: string;
    is_applicant: boolean;
    sale_price: FilteredFields;
    deposit_price: FilteredFields;
    rent_price: FilteredFields;
    normal_days_price: FilteredFields;
    number_of_rooms: FilteredFields;
    max_capicity: FilteredFields;
    size: FilteredFields;
    year_built: FilteredFields;
    province_id: number;
    items: Item[];
    has_video: boolean;
    page: number;
    per_page: number;
}
export {};
