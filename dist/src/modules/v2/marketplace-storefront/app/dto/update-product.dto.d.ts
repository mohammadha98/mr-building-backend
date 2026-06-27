declare class AdItem {
    id: string;
    value: string;
}
export declare class UpdateProductDto {
    client_id: number;
    product_id: string;
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
}
export {};
