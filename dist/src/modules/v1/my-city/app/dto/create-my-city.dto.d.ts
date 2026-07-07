import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";
import { MyCityFilesEnum } from "../enums/myCity.files.enum";
declare class MyCityFile {
    id?: string;
    tag: MyCityFilesEnum;
    type: string;
    file_name: string;
    thumbnail: string;
    file_type: string;
    sort_number: number;
    priority: string;
}
export declare class UploadFileMyCityDto extends MyCityFile {
    file: string;
}
export declare class CreateMyCityDto {
    category: MyCityCategoriesEnum;
    title: string;
    description: string;
    year_built: number;
    size: number;
    number_of_rooms: number;
    renovation_tax: boolean;
    latitude: number;
    longitude: number;
    province_id: number;
    city_id: number;
    files: MyCityFile[];
}
export {};
