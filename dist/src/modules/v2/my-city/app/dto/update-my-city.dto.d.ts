import { CreateMyCityDto } from "./create-my-city.dto";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";
declare const UpdateMyCityDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMyCityDto>>;
export declare class UpdateMyCityDto extends UpdateMyCityDto_base {
    category: MyCityCategoriesEnum;
    title: string;
    description: string;
    year_built: number;
    size: number;
    number_of_rooms: number;
    status: string;
    renovation_tax: boolean;
    latitude: number;
    longitude: number;
    province_id: number;
    city_id: number;
}
export {};
