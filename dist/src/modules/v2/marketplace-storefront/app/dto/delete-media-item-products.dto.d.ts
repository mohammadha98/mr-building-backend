export declare enum MediaItemTypes {
    temp = "temp",
    file = "file"
}
export declare class DeleteMediaProductsDto {
    client_id: number;
    type: string;
    item_id: number;
}
