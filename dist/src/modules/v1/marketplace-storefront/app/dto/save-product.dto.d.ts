declare class AdItem {
    id: string;
    value: string;
}
declare class AdMedia {
    id: number;
    file_name: string;
    file_type: string;
    sort_number: number;
    priority: string;
}
export declare class SaveProductDto {
    client_id: number;
    tracking_code: string;
    storefront_id: string;
    title: string;
    description: string;
    unit_of_sales: string;
    price: number;
    has_discount: boolean;
    discounted_price: number;
    colors: string[];
    category_id: string;
    sub_category_id: string;
    brand_id: string;
    items: AdItem[];
    media: AdMedia[];
}
export {};
