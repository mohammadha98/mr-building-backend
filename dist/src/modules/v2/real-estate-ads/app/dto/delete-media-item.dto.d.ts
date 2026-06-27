export declare enum RealEstateMediaItemTypes {
    temp = "temp",
    file = "file"
}
export declare class DeleteRealEstateMediaItemDto {
    client_id: number;
    type: string;
    item_id: number;
}
