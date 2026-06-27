export declare class FilteredAdNotification_item {
    id: string;
    title: string;
    value: string;
}
export declare class SaveAdSettingsDto {
    item_id?: string;
    title?: string;
    expired_at?: Date;
    provinceId: number;
    cityId: number;
    categoryId?: string;
    subCategoryId?: string;
    smsNotification?: boolean;
    whatsappNotification?: boolean;
    year_built_from: number;
    year_built_to: number;
    size_from: number;
    size_to: number;
    sale_price_from: number;
    sale_price_to: number;
    deposit_price_from: number;
    deposit_price_to: number;
    rent_price_from: number;
    rent_price_to: number;
    normal_days_price_from: number;
    normal_days_price_to: number;
    number_of_rooms_from: number;
    number_of_rooms_to: number;
    max_capicity_from: number;
    max_capicity_to: number;
    items: FilteredAdNotification_item[];
}
