import ServicesTypes from "src/commons/contracts/ServicesTypes";
declare enum ServicesFileType {
    image = "image",
    video = "video"
}
export declare class CreateServiceMediaDto {
    user_id: number;
    file_type: ServicesFileType;
    type: ServicesTypes;
    file: string;
}
export {};
