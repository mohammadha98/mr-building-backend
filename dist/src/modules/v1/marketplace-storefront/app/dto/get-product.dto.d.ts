export declare enum GetProductTypes {
    normal = "normal",
    search = "search"
}
export declare class GetProductDto {
    client_id: number;
    type: GetProductTypes;
    storefront_id: string;
    keyword: string;
    page: number;
    per_page: number;
    status: string;
    sort: string;
}
